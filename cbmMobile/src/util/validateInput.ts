export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  return emailRegex.test(email);
};

export const validateOTPCode = (code: string): boolean => {
  const secretRegex = /^[0-9]{6}$/;
  return secretRegex.test(code);
};
