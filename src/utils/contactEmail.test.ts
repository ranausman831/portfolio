import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildContactEmailMessage,
  createSubmissionFingerprint,
  escapeHtml,
  isDuplicateWithinWindow,
  resolveEmailDeliveryConfig,
  sanitizeHeaderValue,
  validateServerContactPayload,
} from './contactEmail.ts';

test('sanitizeHeaderValue strips newlines and control characters to block header injection', () => {
  const dirty = "Alice\r\nBcc: attacker@evil.com\nSubject: Hijacked";
  assert.equal(sanitizeHeaderValue(dirty), 'Alice Bcc: attacker@evil.com Subject: Hijacked');
});

test('validateServerContactPayload rejects invalid inputs and accepts clean submissions', () => {
  const invalid = validateServerContactPayload({
    name: 'A',
    email: 'invalid-email',
    subject: 'Hi',
    message: 'Short',
  });
  assert.equal(invalid.valid, false);
  if (!invalid.valid) {
    assert.ok(invalid.errors.name);
    assert.ok(invalid.errors.email);
    assert.ok(invalid.errors.subject);
    assert.ok(invalid.errors.message);
  }

  const valid = validateServerContactPayload({
    name: 'Muhammad Ali',
    email: 'ali@example.com',
    subject: 'Agentic AI Collaboration',
    message: 'Interested in building a LangGraph + FastAPI RAG pipeline with you.',
    website: '',
  });
  assert.equal(valid.valid, true);
  if (valid.valid) {
    assert.equal(valid.data.email, 'ali@example.com');
    assert.equal(valid.data.honeypotTriggered, false);
  }
});

test('buildContactEmailMessage escapes HTML and preserves sender email as replyTo', () => {
  const message = buildContactEmailMessage(
    {
      name: 'Sam <Admin>',
      email: 'sam@company.com',
      subject: 'Project Inquiry',
      message: 'Line 1\n<script>alert(1)</script>',
      honeypotTriggered: false,
    },
    'mbox9016@gmail.com'
  );

  assert.equal(message.to, 'mbox9016@gmail.com');
  assert.equal(message.replyToAddress, 'sam@company.com');
  assert.equal(message.replyToName, 'Sam Admin');
  assert.equal(message.replyTo, 'Sam Admin <sam@company.com>');
  assert.ok(message.text.includes('sam@company.com'));
  assert.ok(!message.html.includes('<script>'));
  assert.ok(message.html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
  assert.equal(escapeHtml('"test"'), '&quot;test&quot;');
});

test('resolveEmailDeliveryConfig selects Resend, Gmail SMTP, or none accurately', () => {
  const noneCfg = resolveEmailDeliveryConfig({});
  assert.equal(noneCfg.provider, 'none');
  assert.equal(noneCfg.recipientEmail, 'mbox9016@gmail.com');

  const gmailCfg = resolveEmailDeliveryConfig({ GMAIL_APP_PASSWORD: 'app-password-value' });
  assert.equal(gmailCfg.provider, 'smtp');
  if (gmailCfg.provider === 'smtp') {
    assert.equal(gmailCfg.host, 'smtp.gmail.com');
    assert.equal(gmailCfg.port, 465);
    assert.equal(gmailCfg.user, 'mbox9016@gmail.com');
  }

  const resendCfg = resolveEmailDeliveryConfig({ RESEND_API_KEY: 're_test_key' });
  assert.equal(resendCfg.provider, 'resend');
});

test('isDuplicateWithinWindow detects identical submissions within TTL and expires after window', () => {
  const seen = new Map<string, number>();
  const key = createSubmissionFingerprint('Alex@Company.com', 'Project', 'Hello there team!');
  const sameKeyLower = createSubmissionFingerprint('alex@company.com', 'project', 'Hello there team!');
  assert.equal(key, sameKeyLower);

  assert.equal(isDuplicateWithinWindow(seen, key, 1000, 300_000), false);
  seen.set(key, 1000);
  assert.equal(isDuplicateWithinWindow(seen, sameKeyLower, 60_000, 300_000), true);
  assert.equal(isDuplicateWithinWindow(seen, sameKeyLower, 305_000, 300_000), false);
});
