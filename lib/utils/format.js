export const sanitizeUsername = (value) => {
  return value.toLowerCase().replace(/[^a-z0-9_]/g, "");
};

export const sanitizeFullname = (value) => {
  return value.replace(/[^a-zA-Z\s]/g, "");
};

export const formatEmail = (email) => {
  return email.toLowerCase().trim();
};

export const formatFullname = (fullname) => {
  return fullname.trim();
};
