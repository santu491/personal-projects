export const validateSecret = (secret: string): boolean => {
  /*
   * Secret Validation Rules:
   * - At least one lowercase letter ((?=.*[a-z]))
   * - At least one uppercase letter ((?=.*[A-Z]))
   * - At least one digit ((?=.*\d))
   * - At least one special character ((?=.*[$!@*?|]))
   * - A minimum length of 8 characters ([A-Za-z\d$!@*?|]{8,})
   */
  const secretRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$!@*?|])[A-Za-z\d$!@*?|]{8,}$/;
  return secretRegex.test(secret);
};

export const validateFirstLastName = (code: string): boolean => {
  const firstLastNameRegex = /^[a-zA-Z][a-zA-Z0-9,.-]+$/;
  return firstLastNameRegex.test(code);
};
