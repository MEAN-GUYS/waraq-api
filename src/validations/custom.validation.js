const validator = require('validator');

const objectId = (value, helpers) => {
  if (!validator.isMongoId(value)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  const passwordOptions = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 0,
    minNumbers: 1,
    minSymbols: 0,
  };
  if (!validator.isStrongPassword(value, passwordOptions)) {
    return helpers.message(
      '"{{#label}}" must be at least 8 characters long and contain at least 1 letter and 1 number'
    );
  }

  return value;
};

module.exports = {
  objectId,
  password,
};
