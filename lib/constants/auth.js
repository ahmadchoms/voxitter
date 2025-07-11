export const LOADING_STATES = {
  NONE: null,
  GOOGLE: "google",
  CREDENTIALS: "credentials",
};

export const USERNAME_CHECK_DELAY = 500;

export const MOTION_VARIANTS = {
  button: {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  },
  input: {
    focus: { scale: 1.02 },
    blur: { scale: 1 },
  },
};

export const SIGNUP_FORM_DEFAULTS = {
  username: "",
  fullname: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const SIGNIN_FORM_DEFAULTS = {
  email: "",
  password: "",
};
