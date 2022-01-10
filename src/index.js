import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// --- Components ---
class App extends React.Component {
	render() {
		return (
			<div className="app-container">
				<div className="header">
					<h1>Productivity Zone</h1>
				</div>
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
