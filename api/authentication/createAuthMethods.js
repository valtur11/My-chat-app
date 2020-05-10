/**
 * Function returning all authentication services
 * @param {*} lib all dependecies (Dependecy injection)
 */
const createAuthMethods = (lib) => {
  /**
     * Helper function that creates new token that returns the payload argument and the token. should be private and immutable.
     * @param {Object} payload user details
     */
  function createToken (payload) {
    const options = { expiresIn: '2h' };
    const token = lib.jwt.sign(payload, lib.env.JWT_SECRET, [options]);
    return { ...payload, token };
  }

  return {
    createToken,
    async signup(userDetails) {
      try {
        const User = await lib.user.create(userDetails);
        const UserAndToken = createToken(User);
        return { data: {...UserAndToken}, status: 201 };
      } catch (error) {
        if(error.code === 11000) {
          return { status: 400 };
        } else {
          return { status: 500 };
        }
      }
    }
  };
};

module.exports = createAuthMethods;
