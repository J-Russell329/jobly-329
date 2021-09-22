import React, { useEffect } from 'react';
import '../static/Nav.css';
import Axios from 'axios';
import { BASE_URL } from '../config';

function Home() {
	useEffect(() => {
		Axios.get(BASE_URL);
	}, []);
	return (
		<div id="header">
			<div className="col">
				<h1>
					Welcome to{' '}
					<span style={{ color: 'lightGreen' }}>Jobly</span>!
				</h1>
				<p>
					Be paitent with the comapnies and job tab at first. The API
					is on heroku and needs to be brought out of sleep mode.
				</p>
			</div>
			<div></div>
		</div>
	);
}

export default Home;
