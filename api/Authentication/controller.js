const createAuthMethods = (lib) => {
  return {
    /**
     * Creates new token that returns the payload argument and the token
     * @param {Object} payload user details
     */
    createToken(payload) {
      const options = { expiresIn: '2h' };
      const token = lib.jwt.sign(payload, lib.env.JWT_SECRET, [options]);
      return { ...payload, token };
    }
  };
};
module.exports = createAuthMethods;
