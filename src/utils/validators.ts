export const signupSchema = {
  username: {
    isLength: {
      options: {
        min: 3,
        max: 32,
      },
      errorMessage:
        'Username must be at least 3 characters with a max of 32 characters',
    },
    notEmpty: {
      errorMessage: 'Username cannot be empty',
    },
    isString: {
      errorMessage: 'Username must be a string!',
    },
  },
  email: {
    notEmpty: true,
  },
  password: {
    notEmpty: true,
  },
}
