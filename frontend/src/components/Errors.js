import React from 'react';

function Errors({ errors }) {
	return errors.map((error) => <p>{error}</p>);
}

export default Errors;
