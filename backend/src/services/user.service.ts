import crypto from "crypto";
export const generateVerificationToken = (digit = 6) => {
  const min = 10 ** (digit - 1);
  const max = 10 ** digit - 1;
  const token = crypto.randomInt(min, max).toString();
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return { token, expires };
};
