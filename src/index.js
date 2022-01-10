import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// --- Components ---
function TitleDisplay(props) {
	return (
		<h1 className="title-display">Productivity Zone</h1>
	);
}

class ProfileInfo extends React.Component {
	render() {
		return (
			<p className="profile-info">Welcome, guest.</p>
		);
	}
}

class Header extends React.Component {
	render() {
		return (
			<div className="header">
				<TitleDisplay />
				<ProfileInfo />
			</div>
		);
	}
}

class App extends React.Component {
	render() {
		return (
			<div className="app-container">
				<Header />
				<div className="container">
					<div className="col-filler" />
					<div className="content">
						Work in Progress
					</div>
					<div className="col-filler" />
				</div>
				<div className="footer">
					Made by me
				</div>
			</div>
		);
	}
}

// --- Functions ---

// --- Render ---
ReactDOM.render(
	<App />,
	document.getElementById('root')
);
