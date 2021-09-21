/** Shared config for application; can be required many places. */

const SECRET_KEY = 'secret-dev';
let BASE_URL;

if (NODE_ENV === 'production') {
	BASE_URL = 'https://jobly-backend-329.herokuapp.com/';
} else {
	BASE_URL = 'http://localhost:3001';
}

module.exports = {
	SECRET_KEY,
	BASE_URL,
};
