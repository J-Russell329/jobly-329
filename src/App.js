import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './App.css';
import AllRoutes from './components/AllRoutes';
import Nav from './components/Nav';
import UserContext from './components/UserContext';
import JoblyApi from './helpers/api';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from './config';
import Errors from './components/Errors';

function App() {
	const [user, setUser] = useState(() => getLocalUserData());
	const [errors, setErrors] = useState([]);
	const [appliedJobs, setAppliedJobs] = useState(new Set());
	const [query, setQuery] = useState(null);
	const history = useHistory();
	const location = useLocation();

	useEffect(() => {
		setErrors([]);
	}, [location]);

	useEffect(() => {
		localStorage.setItem('token', user.token);
		if (user.token && user.username) {
			JoblyApi.getUserData(user.username, user.token).then((value) => {
				let tempSet = new Set();
				for (let i in value.applications) {
					tempSet.add(value.applications[i]);
				}
				setAppliedJobs(tempSet);
			});
		}
	}, [user]);

	function getLocalUserData() {
		if (localStorage.getItem('token')) {
			const { username, isAdmin, iat } = jwt.verify(
				localStorage.token,
				SECRET_KEY
			);
			return { username, isAdmin, iat, token: localStorage.token };
		} else {
			return { username: '', isAdmin: false, iat: '', token: '' };
		}
	}

	function registerUser(userInfo) {
		JoblyApi.register(userInfo)
			.then((value) => {
				const token = value.token;
				const { username, isAdmin, iat } = jwt.verify(
					token,
					SECRET_KEY
				);
				setUser({ username, isAdmin, iat, token });
				history.push('/');
			})
			.catch((err) => {
				let errList = [];
				for (let i in err) {
					errList.push(err[i].replace('instance.', ''));
				}
				setErrors(errList);
			});
	}

	function loginUser(userInfo) {
		JoblyApi.login(userInfo)
			.then((value) => {
				const token = value.token;
				const { username, isAdmin, iat } = jwt.verify(
					token,
					SECRET_KEY
				);
				setUser({ username, isAdmin, iat, token });
				history.push('/');
			})
			.catch((err) => {
				let errList = [];
				for (let i in err) {
					errList.push(err[i].replace('instance.', ''));
				}
				setErrors(errList);
			});
	}

	function logOut() {
		setUser({ username: '', isAdmin: false, iat: '', token: '' });
	}

	function jobApply(jobId) {
		if (!user.token) {
			alert('must be logged in to apply to jobs');
			return;
		}
		JoblyApi.jobApply(user.username, jobId, user.token)
			.then(() => {
				let tempSet = new Set(appliedJobs);
				tempSet.add(jobId);
				setAppliedJobs(tempSet);
			})
			.catch((err) => {
				if (
					err[0].includes(
						'duplicate key value violates unique constraint'
					)
				) {
					let tempSet = new Set(appliedJobs);
					tempSet.add(jobId);
					setAppliedJobs(tempSet);
				}
			});
	}

	function updateUserData(userInfo) {
		JoblyApi.updateUserData(userInfo)
			.then(() => {
				alert('updated');
			})
			.catch(() =>
				alert("whoops, our fairies couldn't update your profile")
			);
	}

	return (
		<UserContext.Provider
			value={{ user, errors, setErrors, appliedJobs, setQuery, query }}
		>
			<div className="App">
				<div>
					<Nav logOut={logOut} />
				</div>

				<div className="main-content">
					<div className="errors">
						<Errors errors={errors} />
					</div>
					<AllRoutes
						registerUser={registerUser}
						loginUser={loginUser}
						jobApply={jobApply}
						updateUserData={updateUserData}
						setErrors={setErrors}
					/>
				</div>
			</div>
		</UserContext.Provider>
	);
}

export default App;
