import { LIFECYCLE_STATUSES, STATUSES } from '../../context/LoanContext';

export const LETTER_TYPES = {
  SETTLEMENT: 'SETTLEMENT',
  PAID_UP: 'PAID_UP',
  CONFIRMATION: 'CONFIRMATION',
};

export const getOutstandingAmount = (loan) => {
  const directOutstanding = Number(loan?.outstandingAmount);
  if (Number.isFinite(directOutstanding)) return Math.max(0, directOutstanding);

  const installmentOutstanding =
    loan?.installments?.reduce(
      (sum, installment) =>
        sum + Math.max(0, Number(installment.amount || 0) - Number(installment.paidAmount || 0)),
      0
    ) || 0;

  return Math.max(0, installmentOutstanding);
};

export const isPaidUpEligible = (loan) => {
  const outstanding = getOutstandingAmount(loan);
  return (
    outstanding <= 0 &&
    (loan?.lifecycleStatus === LIFECYCLE_STATUSES.CLOSED || loan?.status === STATUSES.PAID)
  );
};

export const isConfirmationEligible = (loan) => {
  return (
    loan?.lifecycleStatus === LIFECYCLE_STATUSES.ACTIVE ||
    loan?.lifecycleStatus === LIFECYCLE_STATUSES.DISBURSED ||
    loan?.status === STATUSES.ACTIVE ||
    loan?.status === STATUSES.DISBURSED
  );
};

export const getLetterEligibility = (type, loan) => {
  if (!loan) {
    return { allowed: false, reason: 'No loan found for this user.' };
  }

  if (type === LETTER_TYPES.SETTLEMENT) {
    return { allowed: true };
  }

  if (type === LETTER_TYPES.PAID_UP) {
    return isPaidUpEligible(loan)
      ? { allowed: true }
      : { allowed: false, reason: 'Paid-up letter is available only after full repayment.' };
  }

  if (type === LETTER_TYPES.CONFIRMATION) {
    return isConfirmationEligible(loan)
      ? { allowed: true }
      : { allowed: false, reason: 'Confirmation letter is available only for active loans.' };
  }

  return { allowed: false, reason: 'Unsupported letter type.' };
};

