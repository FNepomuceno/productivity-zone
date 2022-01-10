import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// --- Components ---
class Header extends React.Component {
	render() {
		return (
			<div className="header">
				<h1 className="title-display">Productivity Zone</h1>
				<p className="profile-info">Welcome, guest.</p>
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
