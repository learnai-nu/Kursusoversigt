function env(name: string): string | undefined {
  return (import.meta.env[name] as string | undefined) || process.env[name];
}

export type LeadNotifyPayload = {
  name: string;
  email: string;
  company: string | null;
  interest: string | null;
  message: string | null;
  course_slug: string | null;
  source_page: string | null;
};

/** Best-effort email via Resend. Never throws to caller. */
export async function notifyLeadEmail(lead: LeadNotifyPayload): Promise<void> {
  const to = env('LEAD_NOTIFY_EMAIL');
  const apiKey = env('RESEND_API_KEY');
  if (!to || !apiKey) return;

  const from = env('LEAD_NOTIFY_FROM') || 'Kursusoversigten <leads@learnai.nu>';
  const lines = [
    `Navn: ${lead.name}`,
    `E-mail: ${lead.email}`,
    `Virksomhed: ${lead.company || '—'}`,
    `Interesse: ${lead.interest || '—'}`,
    `Kursus: ${lead.course_slug || '—'}`,
    `Side: ${lead.source_page || '—'}`,
    '',
    'Besked:',
    lead.message || '—',
  ];

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Ny lead: ${lead.name}`,
        text: lines.join('\n'),
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('lead email failed', res.status, text.slice(0, 300));
    }
  } catch (err) {
    console.error('lead email error', err);
  }
}
