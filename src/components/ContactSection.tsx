import { useRef, useState, type FormEvent } from 'react';
import {
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Linkedin,
  Loader2,
  Mail,
  MessageCircle,
  Send,
} from 'lucide-react';
import { CONTACT_INFO } from '../data/portfolioData';
import {
  validateContactMessage,
  type ContactFormInput,
} from '../utils/voxelPortraitMath';
import { AvailabilityBadge } from './AvailabilityBadge';

interface SubmissionOutcome {
  draft: ContactFormInput;
  delivered: boolean;
  recipientEmail: string;
}

export function ContactSection() {
  const [form, setForm] = useState<ContactFormInput>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [websiteHoneypot, setWebsiteHoneypot] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormInput, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [submissionOutcome, setSubmissionOutcome] = useState<SubmissionOutcome | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const isSubmittingRef = useRef(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_INFO.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    setSubmitError(null);

    const validation = validateContactMessage(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      setSubmissionOutcome(null);
      return;
    }

    isSubmittingRef.current = true;
    setErrors({});
    setIsSending(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          website: websiteHoneypot,
        }),
      });

      const rawBody = await response.text();
      let data: {
        ok?: boolean;
        delivered?: boolean;
        recipientEmail?: string;
        errors?: Partial<Record<keyof ContactFormInput, string>>;
        error?: string;
      } = {};
      if (rawBody && rawBody.trim().startsWith('{')) {
        try {
          data = JSON.parse(rawBody) as typeof data;
        } catch {
          data = {};
        }
      }

      if (!response.ok || !data.ok) {
        if (data.errors) {
          setErrors(data.errors);
        }
        setSubmitError(
          data.error ||
            `Could not send your message right now (HTTP ${response.status}). Please try again or email directly.`
        );
        return;
      }

      setSubmissionOutcome({
        draft: { ...form },
        delivered: Boolean(data.delivered),
        recipientEmail: data.recipientEmail || CONTACT_INFO.email,
      });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setSubmitError(
        'Network error while sending your message. Please try again or use the email link on the left.'
      );
    } finally {
      isSubmittingRef.current = false;
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setForm({ name: '', email: '', subject: '', message: '' });
    setWebsiteHoneypot('');
    setErrors({});
    setSubmitError(null);
    setSubmissionOutcome(null);
  };

  return (
    <section
      id="contact"
      data-scroll-section
      className="relative scroll-mt-14 border-t border-[#E2E8F0] bg-white py-14 text-[#172033] transition-colors duration-200 sm:scroll-mt-16 sm:py-24 lg:py-28 dark:border-white/10 dark:bg-[#070709] dark:text-[#F4F4F6]"
    >
      <span
        data-scroll-seam
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-[1.5px] w-40 origin-left bg-[#F97316] dark:bg-[#FF5A1F]"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-16">
          {/* Left Info & Direct Channels */}
          <div data-stagger-group className="lg:col-span-5">
            <p
              data-stagger-item
              className="font-mono text-xs font-medium text-[#C2410C] dark:text-[#FF8C42]"
            >
              08. Contact
            </p>
            <h2
              data-stagger-item
              className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-[#172033] sm:text-4xl [text-wrap:balance] dark:text-white"
            >
              Let&apos;s build intelligent AI workflows together.
            </h2>
            <p
              data-stagger-item
              className="mt-4 text-sm leading-relaxed text-[#64748B] sm:text-base dark:text-zinc-400"
            >
              Open to Agentic AI Engineering opportunities, autonomous workflow builds, RAG
              systems, and technical collaborations.
            </p>

            <div data-stagger-item className="mt-6">
              <AvailabilityBadge variant="card" />
            </div>

            {/* Contact Links */}
            <div className="mt-6 space-y-3">
              {/* LinkedIn (Verified User URL) */}
              <a
                data-stagger-item
                href={CONTACT_INFO.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 shadow-[var(--shadow-card)] transition-all hover:border-[#F97316] hover:bg-white sm:rounded-sm dark:border-white/10 dark:bg-[#101015] dark:hover:border-[#FF5A1F]"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <Linkedin className="h-5 w-5 shrink-0 text-[#F97316] dark:text-[#FF5A1F]" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-[#64748B] dark:text-zinc-500">LinkedIn</p>
                    <p className="truncate text-sm font-semibold text-[#172033] group-hover:text-[#C2410C] dark:text-white dark:group-hover:text-[#FF8C42]">
                      {CONTACT_INFO.linkedinLabel}
                    </p>
                  </div>
                </div>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-[#94A3B8] group-hover:text-[#F97316] dark:text-zinc-400 dark:group-hover:text-[#FF5A1F]"
                  aria-hidden="true"
                />
              </a>

              {/* Email with mailto + Copy Action */}
              <div
                data-stagger-item
                className="flex items-center justify-between gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 shadow-[var(--shadow-card)] transition-colors hover:border-[#CBD5E1] hover:bg-white sm:rounded-sm dark:border-white/10 dark:bg-[#101015] dark:hover:border-white/20"
              >
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="group flex min-w-0 flex-1 items-center gap-3.5"
                >
                  <Mail className="h-5 w-5 shrink-0 text-[#F97316] dark:text-[#FF5A1F]" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-[#64748B] dark:text-zinc-500">Email</p>
                    <p className="truncate text-sm font-semibold text-[#172033] transition-colors group-hover:text-[#C2410C] dark:text-zinc-200 dark:group-hover:text-[#FF8C42]">
                      {CONTACT_INFO.email}
                    </p>
                  </div>
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label="Copy email address"
                  className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-sm border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs font-medium text-[#172033] transition-colors hover:border-[#F97316] hover:bg-[#FFF7ED] hover:text-[#C2410C] sm:min-h-[36px] dark:border-white/15 dark:bg-[#181820] dark:text-zinc-200 dark:hover:bg-[#181820] cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#F97316] dark:text-[#FF5A1F]" aria-hidden="true" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* GitHub Profile Link */}
              <a
                data-stagger-item
                href={CONTACT_INFO.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] p-4 shadow-[var(--shadow-card)] transition-all hover:border-[#F97316] hover:bg-white dark:border-white/10 dark:bg-[#101015] dark:hover:border-[#FF5A1F]"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <Github className="h-5 w-5 shrink-0 text-[#F97316] dark:text-[#FF5A1F]" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-[#64748B] dark:text-zinc-500">GitHub</p>
                    <p className="truncate text-sm font-semibold text-[#172033] group-hover:text-[#C2410C] dark:text-white dark:group-hover:text-[#FF8C42]">
                      {CONTACT_INFO.githubLabel}
                    </p>
                  </div>
                </div>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-[#94A3B8] group-hover:text-[#F97316] dark:text-zinc-400 dark:group-hover:text-[#FF5A1F]"
                  aria-hidden="true"
                />
              </a>

              {/* Optional WhatsApp Direct Channel (renders only when configured in CONTACT_INFO) */}
              {CONTACT_INFO.whatsappUrl && CONTACT_INFO.whatsappLabel && (
                <a
                  data-stagger-item
                  href={CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] p-4 shadow-[var(--shadow-card)] transition-all hover:border-[#F97316] hover:bg-white dark:border-white/10 dark:bg-[#101015] dark:hover:border-[#FF5A1F]"
                >
                  <div className="flex min-w-0 items-center gap-3.5">
                    <MessageCircle
                      className="h-5 w-5 shrink-0 text-[#F97316] dark:text-[#FF5A1F]"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-[#64748B] dark:text-zinc-500">WhatsApp</p>
                      <p className="truncate text-sm font-semibold text-[#172033] group-hover:text-[#C2410C] dark:text-white dark:group-hover:text-[#FF8C42]">
                        {CONTACT_INFO.whatsappLabel}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-[#94A3B8] group-hover:text-[#F97316] dark:text-zinc-400 dark:group-hover:text-[#FF5A1F]"
                    aria-hidden="true"
                  />
                </a>
              )}
            </div>
          </div>

          {/* Right Interactive Message Composer */}
          <div className="lg:col-span-7">
            <div
              data-clip-reveal="panel"
              className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 shadow-[var(--shadow-elevated)] sm:rounded-sm sm:p-8 dark:border-white/15 dark:bg-[#101015]"
            >
              <h3 className="font-display text-xl font-bold text-[#172033] dark:text-white">
                Send a Message
              </h3>
              <p className="mt-1 text-xs text-[#64748B] dark:text-zinc-400">
                Compose an inquiry directly below or connect via LinkedIn.
              </p>

              {submissionOutcome ? (
                <div
                  role="status"
                  className="mt-6 rounded-sm border border-[#F97316]/40 bg-[#FFF7ED] p-6 dark:border-[#FF5A1F]/40 dark:bg-[#171210]"
                >
                  <p className="font-mono text-xs font-medium text-[#C2410C] dark:text-[#FF8C42]">
                    {submissionOutcome.delivered
                      ? 'Email Delivered'
                      : 'Email Delivery Setup Pending'}
                  </p>
                  <h4 className="mt-2 font-display text-lg font-semibold text-[#172033] dark:text-white">
                    {submissionOutcome.delivered
                      ? `Thanks, ${submissionOutcome.draft.name} — your email is on its way.`
                      : `Thanks, ${submissionOutcome.draft.name}.`}
                  </h4>
                  <p className="mt-2 text-sm text-[#334155] dark:text-zinc-300">
                    {submissionOutcome.delivered ? (
                      <>
                        Your message regarding &ldquo;{submissionOutcome.draft.subject}&rdquo; was
                        sent to{' '}
                        <span className="font-medium text-[#172033] dark:text-white">
                          {submissionOutcome.recipientEmail}
                        </span>{' '}
                        with your reply address ({submissionOutcome.draft.email}) attached.
                      </>
                    ) : (
                      <>
                        Your message regarding &ldquo;{submissionOutcome.draft.subject}&rdquo; was
                        validated, and inbox delivery to{' '}
                        <span className="font-medium text-[#172033] dark:text-white">
                          {submissionOutcome.recipientEmail}
                        </span>{' '}
                        will activate automatically once{' '}
                        <code className="font-mono text-xs text-[#C2410C] dark:text-[#FFB088]">
                          GMAIL_APP_PASSWORD
                        </code>{' '}
                        or{' '}
                        <code className="font-mono text-xs text-[#C2410C] dark:text-[#FFB088]">
                          RESEND_API_KEY
                        </code>{' '}
                        is added in Settings &rarr; Secrets. You can also send immediately below:
                      </>
                    )}
                  </p>
                  <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                    {!submissionOutcome.delivered && (
                      <a
                        href={`mailto:${submissionOutcome.recipientEmail}?subject=${encodeURIComponent(submissionOutcome.draft.subject)}&body=${encodeURIComponent(`Hi Muhammad Usman,\n\n${submissionOutcome.draft.message}\n\nBest regards,\n${submissionOutcome.draft.name} (${submissionOutcome.draft.email})`)}`}
                        className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm bg-[#F97316] px-4 py-2 text-xs font-semibold text-[#172033] hover:bg-[#EA580C] sm:min-h-[40px] sm:w-auto dark:bg-[#FF5A1F] dark:text-[#070709] dark:hover:bg-[#FF6E38]"
                      >
                        <span>Send via Email App</span>
                        <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    )}
                    <a
                      href={CONTACT_INFO.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm border border-[#CBD5E1] bg-white px-4 py-2 text-xs font-medium text-[#172033] hover:border-[#F97316] hover:text-[#C2410C] sm:min-h-[40px] sm:w-auto dark:border-white/15 dark:bg-transparent dark:text-zinc-200 dark:hover:text-white"
                    >
                      <span>Open LinkedIn Profile</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                    <button
                      type="button"
                      onClick={handleReset}
                      className={`min-h-[44px] w-full rounded-sm px-4 py-2 text-xs font-semibold sm:min-h-[40px] sm:w-auto cursor-pointer ${
                        submissionOutcome.delivered
                          ? 'bg-[#F97316] text-[#172033] hover:bg-[#EA580C] dark:bg-[#FF5A1F] dark:text-[#070709] dark:hover:bg-[#FF6E38]'
                          : 'border border-[#CBD5E1] bg-white text-[#172033] hover:border-[#F97316] hover:text-[#C2410C] dark:border-white/15 dark:bg-transparent dark:text-zinc-300 dark:hover:border-white/30 dark:hover:text-white'
                      }`}
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                  {/* Honeypot field for automated spam filtering */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="contact-website">Website</label>
                    <input
                      id="contact-website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={websiteHoneypot}
                      onChange={(e) => setWebsiteHoneypot(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-medium text-[#334155] dark:text-zinc-300"
                      >
                        Full Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Alex Rivera"
                        className="mt-1.5 min-h-[46px] w-full rounded-sm border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-base text-[#172033] placeholder:text-[#94A3B8] transition-colors focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/15 focus:outline-none sm:text-sm dark:border-white/15 dark:bg-[#09090D] dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-[#FF5A1F] dark:focus:ring-0"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs font-medium text-[#C2410C] dark:text-[#FF8C42]">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-medium text-[#334155] dark:text-zinc-300"
                      >
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@company.com"
                        className="mt-1.5 min-h-[46px] w-full rounded-sm border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-base text-[#172033] placeholder:text-[#94A3B8] transition-colors focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/15 focus:outline-none sm:text-sm dark:border-white/15 dark:bg-[#09090D] dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-[#FF5A1F] dark:focus:ring-0"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs font-medium text-[#C2410C] dark:text-[#FF8C42]">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      className="block text-xs font-medium text-[#334155] dark:text-zinc-300"
                    >
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="Agentic AI Project or Engineering Role"
                      className="mt-1.5 min-h-[46px] w-full rounded-sm border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-base text-[#172033] placeholder:text-[#94A3B8] transition-colors focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/15 focus:outline-none sm:text-sm dark:border-white/15 dark:bg-[#09090D] dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-[#FF5A1F] dark:focus:ring-0"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-xs font-medium text-[#C2410C] dark:text-[#FF8C42]">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-medium text-[#334155] dark:text-zinc-300"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Share details about the AI agent, RAG pipeline, or automation workflow you want to build..."
                      className="mt-1.5 w-full resize-none rounded-sm border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-base text-[#172033] placeholder:text-[#94A3B8] transition-colors focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/15 focus:outline-none sm:text-sm dark:border-white/15 dark:bg-[#09090D] dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-[#FF5A1F] dark:focus:ring-0"
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs font-medium text-[#C2410C] dark:text-[#FF8C42]">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {submitError && (
                    <p
                      role="alert"
                      className="text-xs font-medium text-[#C2410C] dark:text-[#FF8C42]"
                    >
                      {submitError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSending}
                    className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-sm bg-[#F97316] px-6 py-2.5 text-sm font-semibold text-[#172033] shadow-[0_8px_20px_-8px_rgba(249,115,22,0.5)] transition-colors hover:bg-[#EA580C] disabled:opacity-60 disabled:cursor-not-allowed sm:min-h-[44px] sm:w-auto dark:bg-[#FF5A1F] dark:text-[#070709] dark:shadow-none dark:hover:bg-[#FF6E38] cursor-pointer"
                  >
                    {isSending ? (
                      <>
                        <span>Sending...</span>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
