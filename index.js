const { get } = require('axios');

module.exports = () => {
	const start = async ({ config }) => {

    const { url } = config;

    if (!url) {
      throw new Error('Auth API url is not set, please check configuration.');
    }

    const getUserData = token => get(url, { headers: { 'authorization': token }})
      .then(response => response.data)
      .catch(err => err);

		const authenticate = async (req, res, next) => {
			try {
				const token = req.headers.authorization;
				if (!token) throw new Error('Missing token');
				res.locals.userData = await getUserData(token);
				return next();
			} catch (error) {
				return res.status(403).send(`Authentication failed: ${error.message}`);
			}
		};

		return {
			authenticate,
		};
	};

	return { start };
};
