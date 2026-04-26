import DOMPurify from 'dompurify';

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[\d\s\-\+\(\)]{7,}$/;
  return re.test(phone);
};

export const validateSpecialRequests = (text) => {
  if (!text) return true;
  return text.length <= 500;
};

export const sanitizeText = (text) => {
  if (typeof text !== 'string') return text;
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

export const validateBookingInput = (data) => {
  const errors = {};
  let isValid = true;

  console.log('[Validation] Validating booking input:', data);

  // Email Validation
  if (!data.email || !validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address.';
    isValid = false;
  }

  // Phone Validation
  if (!data.phone || !validatePhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number (min 7 digits/chars).';
    isValid = false;
  }

  // Name Validation
  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.firstName = 'First name is required.';
    isValid = false;
  }
  if (!data.lastName || data.lastName.trim().length < 2) {
    errors.lastName = 'Last name is required.';
    isValid = false;
  }

  // Special Requests Validation
  if (data.specialRequests && !validateSpecialRequests(data.specialRequests)) {
    errors.specialRequests = 'Special requests cannot exceed 500 characters.';
    isValid = false;
  }

  // Terms
  if (!data.termsAccepted || !data.policyAccepted || !data.privacyAccepted) {
    errors.terms = 'You must accept all terms and policies.';
    isValid = false;
  }

  console.log('[Validation] Result:', { isValid, errors });

  return { isValid, errors };
};