export interface ContactSubmissionInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
}

export interface SanitizedContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypotTriggered: boolean;
}

export type ContactValidationResult =
  | {
      valid: true;
      data: SanitizedContactPayload;
    }
  | {
      valid: false;
      errors: Partial<Record<'name' | 'email' | 'subject' | 'message', string>>;
    };

export type EmailDeliveryConfig =
  | {
      provider: 'resend';
      apiKey: string;
      fromEmail: string;
      recipientEmail: string;
    }
  | {
      provider: 'smtp';
      host: string;
      port: number;
      secure: boolean;
      user: string;
      pass: string;
      fromEmail: string;
      recipientEmail: string;
    }
  | {
      provider: 'none';
      recipientEmail: string;
    };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Removes CR/LF and null bytes to prevent SMTP / email header injection.
 */
export function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n\0]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Escapes HTML special characters for safe interpolation inside HTML email bodies.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function validateServerContactPayload(raw: unknown): ContactValidationResult {
  if (!raw || typeof raw !== 'object') {
    return {
      valid: false,
      errors: {
        name: 'Please enter your name.',
        email: 'Please enter a valid email address.',
        subject: 'Please provide a brief subject.',
        message: 'Please write a message of at least 10 characters.',
      },
    };
  }

  const record = raw as Record<string, unknown>;
  const honeypot = typeof record.website === 'string' ? record.website.trim() : '';
  const name = sanitizeHeaderValue(typeof record.name === 'string' ? record.name : '');
  const email = sanitizeHeaderValue(typeof record.email === 'string' ? record.email : '');
  const subject = sanitizeHeaderValue(typeof record.subject === 'string' ? record.subject : '');
  const message = (typeof record.message === 'string' ? record.message : '').replace(/\0/g, '').trim();

  const errors: Partial<Record<'name' | 'email' | 'subject' | 'message', string>> = {};

  if (name.length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).';
  } else if (name.length > 100) {
    errors.name = 'Name must be 100 characters or fewer.';
  }

  if (!EMAIL_REGEX.test(email) || email.length > 160) {
    errors.email = 'Please enter a valid email address.';
  }

  if (subject.length < 3) {
    errors.subject = 'Please provide a brief subject (at least 3 characters).';
  } else if (subject.length > 180) {
    errors.subject = 'Subject must be 180 characters or fewer.';
  }

  if (message.length < 10) {
    errors.message = 'Please write a message of at least 10 characters.';
  } else if (message.length > 5000) {
    errors.message = 'Message must be 5,000 characters or fewer.';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      name,
      email,
      subject,
      message,
      honeypotTriggered: honeypot.length > 0,
    },
  };
}

export function resolveEmailDeliveryConfig(
  env: Record<string, string | undefined>,
  defaultRecipient = 'mbox9016@gmail.com'
): EmailDeliveryConfig {
  const recipientEmail = sanitizeHeaderValue(env.CONTACT_RECIPIENT_EMAIL || defaultRecipient) || defaultRecipient;

  const resendApiKey = (env.RESEND_API_KEY || '').trim();
  if (resendApiKey) {
    const fromEmail = sanitizeHeaderValue(env.RESEND_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>');
    return {
      provider: 'resend',
      apiKey: resendApiKey,
      fromEmail,
      recipientEmail,
    };
  }

  const gmailPass = (env.GMAIL_APP_PASSWORD || '').trim();
  const smtpPass = (env.SMTP_PASS || '').trim();
  const pass = smtpPass || gmailPass;

  if (pass) {
    const user = sanitizeHeaderValue(env.SMTP_USER || env.GMAIL_USER || recipientEmail);
    const host = sanitizeHeaderValue(env.SMTP_HOST || 'smtp.gmail.com');
    const parsedPort = Number(env.SMTP_PORT || '465');
    const port = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 465;
    const secure = env.SMTP_SECURE ? env.SMTP_SECURE === 'true' : port === 465;
    const fromEmail = sanitizeHeaderValue(env.SMTP_FROM || `Portfolio Inquiry <${user}>`);

    return {
      provider: 'smtp',
      host,
      port,
      secure,
      user,
      pass,
      fromEmail,
      recipientEmail,
    };
  }

  return {
    provider: 'none',
    recipientEmail,
  };
}

export function createSubmissionFingerprint(
  email: string,
  subject: string,
  message: string
): string {
  return `${email.trim().toLowerCase()}\0${subject.trim().toLowerCase()}\0${message.trim()}`;
}

export function isDuplicateWithinWindow(
  seenTimestamps: Map<string, number>,
  key: string,
  nowMs: number,
  windowMs: number
): boolean {
  for (const [entryKey, recordedAt] of seenTimestamps.entries()) {
    if (nowMs - recordedAt >= windowMs) {
      seenTimestamps.delete(entryKey);
    }
  }

  const previous = seenTimestamps.get(key);
  return typeof previous === 'number' && nowMs - previous < windowMs;
}

export function buildContactEmailMessage(
  payload: SanitizedContactPayload,
  recipientEmail: string
): {
  to: string;
  replyTo: string;
  replyToName: string;
  replyToAddress: string;
  subject: string;
  text: string;
  html: string;
} {
  const replyToName = payload.name.replace(/[<>"]/g, '').trim() || payload.email;
  const replyToAddress = payload.email;
  const safeReplyTo = `${replyToName} <${replyToAddress}>`;
  const emailSubject = `[Portfolio Inquiry] ${payload.subject}`;
  const receivedAt = new Date().toISOString();

  const text = [
    'New message from your Agentic AI Portfolio contact form',
    '--------------------------------------------------------',
    `From: ${payload.name}`,
    `Sender Email: ${payload.email}`,
    `Subject: ${payload.subject}`,
    `Received: ${receivedAt}`,
    '',
    'Message:',
    payload.message,
    '',
    '--------------------------------------------------------',
    `Reply directly to this email to respond to ${payload.email}.`,
  ].join('\n');

  const safeNameHtml = escapeHtml(payload.name);
  const safeEmailHtml = escapeHtml(payload.email);
  const safeSubjectHtml = escapeHtml(payload.subject);
  const safeMessageHtml = escapeHtml(payload.message).replace(/\r?\n/g, '<br />');

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background:#0b0b0f; color:#f4f4f6; padding:24px; border-radius:6px; max-width:640px;">
      <p style="margin:0 0 8px; font-size:12px; letter-spacing:0.06em; text-transform:uppercase; color:#ff8c42;">Portfolio Contact Inquiry</p>
      <h2 style="margin:0 0 18px; font-size:20px; color:#ffffff;">${safeSubjectHtml}</h2>
      <div style="background:#13131a; border:1px solid #262632; border-radius:4px; padding:16px; margin-bottom:18px;">
        <p style="margin:0 0 6px; font-size:13px; color:#a1a1aa;"><strong style="color:#ffffff;">From:</strong> ${safeNameHtml}</p>
        <p style="margin:0 0 6px; font-size:13px; color:#a1a1aa;"><strong style="color:#ffffff;">Sender Email:</strong> <a href="mailto:${safeEmailHtml}" style="color:#ff8c42;">${safeEmailHtml}</a></p>
        <p style="margin:0; font-size:12px; color:#71717a;">Received ${escapeHtml(receivedAt)}</p>
      </div>
      <div style="background:#101015; border-left:3px solid #ff5a1f; padding:14px 16px; font-size:14px; line-height:1.6; color:#e4e4e7;">
        ${safeMessageHtml}
      </div>
      <p style="margin:18px 0 0; font-size:12px; color:#71717a;">Hit Reply in your inbox to respond directly to ${safeEmailHtml}.</p>
    </div>
  `.trim();

  return {
    to: recipientEmail,
    replyTo: safeReplyTo,
    replyToName,
    replyToAddress,
    subject: emailSubject,
    text,
    html,
  };
}
