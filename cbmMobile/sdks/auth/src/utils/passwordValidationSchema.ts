const lengthValidation = (value = '', minLength = 8, maxLength = 20): boolean =>
  value.length >= minLength && value.length <= maxLength;

const noSpacesValidation = (value = ''): boolean => {
  const passwordRegex = /^[^\s]*$/;
  return passwordRegex.test(value);
};

const notAllowedCharactersValidation = (value = ''): boolean => {
  const exp = /^[^&<>\\]*$/;
  return exp.test(value);
};

const alphaNumericValidation = (value = ''): boolean => {
  const exp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).*$/;
  return exp.test(value);
};

const validatePasswordWithUserName = (password: string, userName: string): boolean => {
  const firstThreeChars = userName && userName.substr(0, 3);
  if (userName && (password.includes(userName) || password.includes(firstThreeChars))) {
    return false;
  }
  return true;
};

const noRepetitionCharectersValidation = (password: string): boolean => {
  for (let i = 0; i < password.length - 2; i++) {
    if (password[i] === password[i + 1] && password[i] === password[i + 2]) {
      return false;
    }
  }
  return true;
};

export const PASSWORD_VALIDATION_MESSAGES: PasswordValidationMessages = {
  alphaNumeric: 'It should be Alpha-numeric',
  charactersLength: 'It should contain 8-20 characters',
  noRepetitionCharecters: 'No character repetition more than twice',
  notAllowedCharacters: 'Password cannot contain: &, < , > , \\',
  spaces: 'Password cannot contain spaces',
  userNameCharacters: 'Password should not contain the username or first three characters of username',
};

export interface PasswordValidationMessages {
  alphaNumeric: string;
  charactersLength: string;
  noRepetitionCharecters: string;
  notAllowedCharacters: string;
  spaces: string;
  userNameCharacters: string;
}

export const getPasswordValidationItems = (content: PasswordValidationMessages, password: string, userName = '') => {
  const passwordValidations = [
    {
      message: content.userNameCharacters,
      valid: validatePasswordWithUserName(password, userName),
    },
    {
      message: content.charactersLength,
      valid: lengthValidation(password),
    },
    {
      message: content.spaces,
      valid: noSpacesValidation(password),
    },
    {
      message: content.notAllowedCharacters,
      valid: notAllowedCharactersValidation(password),
    },
    {
      message: content.alphaNumeric,
      valid: alphaNumericValidation(password),
    },
    {
      message: content.noRepetitionCharecters,
      valid: noRepetitionCharectersValidation(password),
    },
  ];
  return passwordValidations;
};

export const getMhsudPasswordValidationItems = (content: PasswordValidationMessages, password: string) => {
  console.log('password', password);
  const passwordValidations = [
    {
      message: content.charactersLength,
      valid: lengthValidation(password),
    },
    {
      message: content.spaces,
      valid: noSpacesValidation(password),
    },
    {
      message: content.notAllowedCharacters,
      valid: notAllowedCharactersValidation(password),
    },

    {
      message: content.noRepetitionCharecters,
      valid: noRepetitionCharectersValidation(password),
    },
  ];
  return passwordValidations;
};
