const DEVELOPMENT_JWT_SECRET = "spacesoul-library-local-development-secret-change-before-production";

const getJwtSecret = () => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;

  if (process.env.NODE_ENV === "production") {
    throw new Error("Thiếu biến môi trường JWT_SECRET trên production");
  }

  return DEVELOPMENT_JWT_SECRET;
};

module.exports = { getJwtSecret };
