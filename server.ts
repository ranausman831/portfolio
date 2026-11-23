import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import crypto from 'crypto';
import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  ABOUT_CONTENT,
  AVAILABILITY_CONFIG,
  CONTACT_INFO,
  FEATURED_PROJECTS,
  GITHUB_PROJECTS,
  HERO_PROFILE,
  SKILLS_DATA,
  TIMELINE_DATA,
} from './src/data/portfolioData.ts';
import {
  buildContactEmailMessage,
  createSubmissionFingerprint,
  isDuplicateWithinWindow,
  resolveEmailDeliveryConfig,
  validateServerContactPayload,
} from './src/utils/contactEmail.ts';
import {
  buildGitHubPublicSummary,
  type GitHubPublicSummary,
} from './src/utils/githubProfile.ts';
import {
  buildPortfolioSystemInstruction,
  isQuotaExhaustedError,
  mapGeminiApiError,
  validateChatRequest,
} from './src/utils/portfolioAssistant.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;
const GITHUB_CACHE_TTL_MS = 15 * 60 * 1000;
const CHAT_CACHE_TTL_MS = 15 * 60 * 1000;

const requestLogByIp = new Map<string, number[]>();
const chatRequestLogByIp = new Map<string, number[]>();
const recentSubmissionHashes = new Map<string, number>();
const chatReplyCache = new Map<string, { reply: string; cachedAt: number }>();
let cachedGitHubSummary: { data: GitHubPublicSummary; fetchedAt: number } | null = null;

function isRateLimited(
  ip: string,
  bucket: Map<string, number[]> = requestLogByIp,
  maxRequests: number = RATE_LIMIT_MAX_REQUESTS
): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = (bucket.get(ip) || []).filter((ts) => ts > windowStart);

  if (recent.length >= maxRequests) {
    bucket.set(ip, recent);
    return true;
  }

  recent.push(now);
  bucket.set(ip, recent);

  if (bucket.size > 500) {
    for (const [key, timestamps] of bucket.entries()) {
      if (timestamps.every((ts) => ts <= windowStart)) {
        bucket.delete(key);
      }
    }
  }

  return false;
}

const PORTFOLIO_SYSTEM_INSTRUCTION = buildPortfolioSystemInstruction({
  name: HERO_PROFILE.name,
  role: HERO_PROFILE.role,
  location: HERO_PROFILE.locationLabel,
  availabilityItems: AVAILABILITY_CONFIG.isActive
    ? [...AVAILABILITY_CONFIG.statuses]
    : ['Currently unavailable for new engagements'],
  aboutLead: ABOUT_CONTENT.lead,
  careerGoal: ABOUT_CONTENT.careerGoal,
  skills: SKILLS_DATA.map((s) => ({
    name: s.name,
    category: s.category,
    roleInStack: s.roleInStack,
  })),
  featuredProjects: FEATURED_PROJECTS.map((p) => ({
    title: p.title,
    category: p.category,
    shortDescription: p.shortDescription,
    architectureSummary: p.architectureSummary,
    technologies: p.technologies,
  })),
  githubProjects: GITHUB_PROJECTS.map((p) => ({
    title: p.title,
    category: p.category,
    description: p.description,
    technologies: p.technologies,
    githubUrl: p.githubUrl,
  })),
  educationAndTimeline: TIMELINE_DATA.map((t) => ({
    period: t.period,
    title: t.title,
    institution: t.institution,
    summary: t.summary,
  })),
  contact: {
    email: CONTACT_INFO.email,
    linkedinUrl: CONTACT_INFO.linkedinUrl,
    githubUrl: CONTACT_INFO.githubUrl,
  },
});

async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '32kb' }));
  app.use((err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err && typeof err === 'object' && 'type' in err && (err as { type?: string }).type === 'entity.parse.failed') {
      res.status(400).json({ ok: false, error: 'Invalid JSON request body.' });
      return;
    }
    next(err);
  });

  app.get('/Muhammad-Usman-Resume.pdf', (_req, res, next) => {
    const publicPdf = path.resolve(__dirname, 'public', 'Muhammad-Usman-Resume.pdf');
    const distPdf = path.resolve(__dirname, 'dist', 'Muhammad-Usman-Resume.pdf');
    const pdfPath = fs.existsSync(publicPdf) ? publicPdf : distPdf;

    if (!fs.existsSync(pdfPath)) {
      next();
      return;
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader(
      'Content-Disposition',
      'inline; filename="Muhammad-Usman-Agentic-AI-Engineer-Resume.pdf"'
    );
    res.sendFile(pdfPath);
  });

  app.get('/api/github', async (_req, res) => {
    const now = Date.now();
    if (cachedGitHubSummary && now - cachedGitHubSummary.fetchedAt < GITHUB_CACHE_TTL_MS) {
      res.json(cachedGitHubSummary.data);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const headers = {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'Muhammad-Usman-Portfolio',
      };

      const [userRes, eventsRes] = await Promise.all([
        fetch('https://api.github.com/users/ranausman831', {
          headers,
          signal: controller.signal,
        }),
        fetch('https://api.github.com/users/ranausman831/events/public?per_page=30', {
          headers,
          signal: controller.signal,
        }),
      ]);

      if (!userRes.ok) {
        const fallback = buildGitHubPublicSummary(null, []);
        res.json(fallback);
        return;
      }

      const userJson = (await userRes.json()) as Record<string, unknown>;
      const eventsJson = eventsRes.ok ? ((await eventsRes.json()) as Array<Record<string, unknown>>) : [];
      const summary = buildGitHubPublicSummary(userJson, Array.isArray(eventsJson) ? eventsJson : []);

      cachedGitHubSummary = { data: summary, fetchedAt: now };
      res.json(summary);
    } catch {
      const fallback = buildGitHubPublicSummary(null, []);
      res.json(fallback);
    } finally {
      clearTimeout(timeoutId);
    }
  });

  app.get('/api/contact/status', (_req, res) => {
    const config = resolveEmailDeliveryConfig(process.env);
    res.json({
      configured: config.provider !== 'none',
      provider: config.provider,
      recipientEmail: config.recipientEmail,
    });
  });

  app.post('/api/contact', async (req, res) => {
    const clientIp = req.ip || 'unknown';
    if (isRateLimited(clientIp)) {
      res.status(429).json({
        ok: false,
        error: 'Too many messages sent recently. Please wait a few minutes or email directly.',
      });
      return;
    }

    const validation = validateServerContactPayload(req.body);
    if (!validation.valid) {
      res.status(400).json({
        ok: false,
        errors: validation.errors,
        error: 'Please check the highlighted fields and try again.',
      });
      return;
    }

    const payload = validation.data;
    if (payload.honeypotTriggered) {
      res.json({ ok: true, delivered: true });
      return;
    }

    const fingerprintHash = crypto
      .createHash('sha256')
      .update(createSubmissionFingerprint(payload.email, payload.subject, payload.message))
      .digest('hex');

    if (isDuplicateWithinWindow(recentSubmissionHashes, fingerprintHash, Date.now(), DUPLICATE_WINDOW_MS)) {
      res.status(409).json({
        ok: false,
        duplicate: true,
        error: 'This message was already sent recently. Please wait a few minutes before submitting it again.',
      });
      return;
    }

    const config = resolveEmailDeliveryConfig(process.env);
    if (config.provider === 'none') {
      res.json({
        ok: true,
        delivered: false,
        reason: 'email_service_not_configured',
        recipientEmail: config.recipientEmail,
      });
      return;
    }

    const emailMessage = buildContactEmailMessage(payload, config.recipientEmail);

    try {
      if (config.provider === 'resend') {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: config.fromEmail,
            to: [emailMessage.to],
            reply_to: emailMessage.replyToAddress,
            subject: emailMessage.subject,
            text: emailMessage.text,
            html: emailMessage.html,
          }),
        });

        if (!resendRes.ok) {
          const detail = await resendRes.text();
          console.error('[contact-email] Resend delivery failed:', resendRes.status, detail);
          res.status(502).json({
            ok: false,
            error: 'Email delivery failed. Please try again or reach out directly via email.',
          });
          return;
        }

        recentSubmissionHashes.set(fingerprintHash, Date.now());
        res.json({
          ok: true,
          delivered: true,
          provider: 'resend',
          recipientEmail: config.recipientEmail,
        });
        return;
      }

      const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.user,
          pass: config.pass,
        },
      });

      await transporter.sendMail({
        from: config.fromEmail,
        to: emailMessage.to,
        replyTo: {
          name: emailMessage.replyToName,
          address: emailMessage.replyToAddress,
        },
        subject: emailMessage.subject,
        text: emailMessage.text,
        html: emailMessage.html,
      });

      recentSubmissionHashes.set(fingerprintHash, Date.now());
      res.json({
        ok: true,
        delivered: true,
        provider: 'smtp',
        recipientEmail: config.recipientEmail,
      });
    } catch (err) {
      console.error('[contact-email] Delivery error:', err);
      res.status(502).json({
        ok: false,
        error: 'Unable to deliver your email right now. Please try again or email directly.',
      });
    }
  });

  app.post('/api/chat', async (req, res) => {
    const clientIp = req.ip || 'unknown';
    if (isRateLimited(clientIp, chatRequestLogByIp, 20)) {
      res.status(429).json({
        ok: false,
        error: 'Too many assistant questions sent recently. Please wait a moment and try again.',
      });
      return;
    }

    const validation = validateChatRequest(req.body);
    if (!validation.valid) {
      res.status(400).json({
        ok: false,
        error: validation.error,
      });
      return;
    }

    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.status(503).json({
        ok: false,
        error:
          'Portfolio AI Assistant is currently offline because GEMINI_API_KEY is not configured. You can inspect projects above or use the Contact form.',
      });
      return;
    }

    const singleTurnCacheKey =
      validation.data.history.length === 0
        ? validation.data.message.toLowerCase()
        : null;

    if (singleTurnCacheKey) {
      const cached = chatReplyCache.get(singleTurnCacheKey);
      if (cached && Date.now() - cached.cachedAt < CHAT_CACHE_TTL_MS) {
        res.json({
          ok: true,
          reply: cached.reply,
        });
        return;
      }
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          timeout: 11000,
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const contents = [
        ...validation.data.history.map((turn) => ({
          role: turn.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: turn.text }],
        })),
        {
          role: 'user',
          parts: [{ text: validation.data.message }],
        },
      ];

      const runGenerate = (
        model: 'gemini-4-hydrogen' | 'gemini-3.1-flash-lite',
        thinkingLevel: ThinkingLevel
      ) =>
        ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: PORTFOLIO_SYSTEM_INSTRUCTION,
            abortSignal: AbortSignal.timeout(11000),
            thinkingConfig: {
              thinkingLevel,
            },
          },
        });

      let response;
      try {
        response = await runGenerate('gemini-4-hydrogen', ThinkingLevel.LOW);
      } catch (firstErr) {
        if (isQuotaExhaustedError(firstErr)) {
          response = await runGenerate('gemini-3.1-flash-lite', ThinkingLevel.MINIMAL);
        } else {
          const msg = firstErr instanceof Error ? firstErr.message.toLowerCase() : '';
          const errStatus =
            firstErr && typeof firstErr === 'object' && 'status' in firstErr
              ? (firstErr as { status?: unknown }).status
              : undefined;
          if (
            errStatus === 400 ||
            errStatus === 401 ||
            errStatus === 403 ||
            errStatus === 404 ||
            msg.includes('api key') ||
            msg.includes('api_key') ||
            msg.includes('401') ||
            msg.includes('403') ||
            msg.includes('permission')
          ) {
            throw firstErr;
          }
          await new Promise((resolve) => setTimeout(resolve, 400));
          response = await runGenerate('gemini-4-hydrogen', ThinkingLevel.LOW);
        }
      }

      const replyText = (response.text || '').trim();
      if (!replyText) {
        res.status(502).json({
          ok: false,
          error: 'Assistant returned an empty response. Please try asking again.',
        });
        return;
      }

      if (singleTurnCacheKey) {
        if (chatReplyCache.size >= 80) {
          const oldestKey = chatReplyCache.keys().next().value;
          if (oldestKey) chatReplyCache.delete(oldestKey);
        }
        chatReplyCache.set(singleTurnCacheKey, { reply: replyText, cachedAt: Date.now() });
      }

      res.json({
        ok: true,
        reply: replyText,
      });
    } catch (err) {
      const mapped = mapGeminiApiError(err);
      if (mapped.status === 429) {
        console.warn('[portfolio-assistant] Gemini quota/rate-limit reached (HTTP 429).');
      } else {
        console.error('[portfolio-assistant] Gemini request error:', err);
      }
      res.status(mapped.status).json({
        ok: false,
        error: mapped.error,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    const indexHtml = path.join(distDir, 'index.html');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
