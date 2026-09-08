export function parseRecipientEmails(emails?: string[] | string | null) {
  if (!emails) {
    return [];
  }

  const values = Array.isArray(emails) ? emails : emails.split(/[;,\n]/);

  return [...new Set(values.map((email) => email.trim()).filter(Boolean))];
}