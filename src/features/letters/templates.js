const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const formatCurrency = (value) => {
  const amount = Number(value) || 0;
  return `R ${amount.toLocaleString()}`;
};

const formatDate = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString();
};

const baseLetterTemplate = ({ title, letterRef, bodyHtml }) => `
  <section style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6; padding: 24px;">
    <header style="border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px;">
      <h1 style="margin: 0; font-size: 24px;">${escapeHtml(title)}</h1>
      <p style="margin: 4px 0 0; font-size: 12px; color: #475569;">Reference: ${escapeHtml(letterRef)}</p>
      <p style="margin: 2px 0 0; font-size: 12px; color: #475569;">Generated On: ${escapeHtml(formatDate())}</p>
    </header>
    ${bodyHtml}
    <footer style="border-top: 1px solid #cbd5e1; margin-top: 24px; padding-top: 12px; font-size: 12px; color: #64748b;">
      This is a system-generated document from LMS.
    </footer>
  </section>
`;

export const buildSettlementLetter = ({ user, loan }) =>
  baseLetterTemplate({
    title: 'Settlement Letter',
    letterRef: `SET-${loan.loanId}`,
    bodyHtml: `
      <p>Dear ${escapeHtml(user.name)},</p>
      <p>
        This letter confirms the current settlement value for your loan account
        <strong>${escapeHtml(loan.loanId)}</strong>.
      </p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">Borrower Name</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">${escapeHtml(user.name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">ID Number</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">${escapeHtml(user.idNumber)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">Loan ID</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">${escapeHtml(loan.loanId)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">Outstanding Amount</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>${escapeHtml(formatCurrency(loan.outstandingAmount))}</strong></td>
        </tr>
      </table>
      <p>
        The above settlement value is valid for 7 calendar days from the generated date.
      </p>
    `,
  });

export const buildPaidUpLetter = ({ user, loan }) =>
  baseLetterTemplate({
    title: 'Paid-up Letter',
    letterRef: `PUP-${loan.loanId}`,
    bodyHtml: `
      <p>Dear ${escapeHtml(user.name)},</p>
      <p>
        This confirms that loan account <strong>${escapeHtml(loan.loanId)}</strong> has been fully settled.
      </p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">Borrower Name</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">${escapeHtml(user.name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">Loan ID</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">${escapeHtml(loan.loanId)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">Original Amount</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">${escapeHtml(formatCurrency(loan.amount))}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">Outstanding Amount</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>${escapeHtml(formatCurrency(loan.outstandingAmount))}</strong></td>
        </tr>
      </table>
      <p>
        No further payment obligations remain on this account.
      </p>
    `,
  });

export const buildConfirmationLetter = ({ user, loan }) =>
  baseLetterTemplate({
    title: 'Loan Confirmation Letter',
    letterRef: `CNF-${loan.loanId}`,
    bodyHtml: `
      <p>Dear ${escapeHtml(user.name)},</p>
      <p>
        This confirms that your loan account <strong>${escapeHtml(loan.loanId)}</strong> is currently active.
      </p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">Borrower Name</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">${escapeHtml(user.name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">Loan ID</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">${escapeHtml(loan.loanId)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">Loan Amount</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">${escapeHtml(formatCurrency(loan.amount))}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #cbd5e1;">Current Status</td>
          <td style="padding: 8px; border: 1px solid #cbd5e1;"><strong>${escapeHtml(loan.statusLabel)}</strong></td>
        </tr>
      </table>
      <p>
        This letter is issued for verification and official documentation purposes.
      </p>
    `,
  });

