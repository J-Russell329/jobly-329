/** Shared config for application; can be required many places. */

const SECRET_KEY = 'secret-dev';
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

module.exports = {
	SECRET_KEY,
	BASE_URL,
};
