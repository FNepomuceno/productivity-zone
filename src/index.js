import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Header from './Header.js';
import ContentContainer from './ContentContainer.js';

import {
	startDB,
	clearGuestTasks,
} from './database.js';

// --- Components ---
class App extends React.Component {
	constructor(props) {
		super(props);
		this.handleLoginClick = this.handleLoginClick.bind(this);
		this.handleLogoutClick = this.handleLogoutClick.bind(this);
		this.handleTabSwitch = this.handleTabSwitch.bind(this);
		this.makeTabUpdater = this.makeTabUpdater.bind(this);
		this.componentCleanup = this.componentCleanup.bind(this);
		this.state = {
			user: null,
			tab: "Tasks",
			db: null,
		};
	}

	componentDidMount() {
		if (!window.indexedDB) {
			console.error("Could not set up database");
		}

		const updateDBstate = (event) => {
			this.setState({
				db: event.target.result,
			});
		}

		startDB(updateDBstate);

		window.addEventListener("beforeunload", this.componentCleanup);
	}

	componentWillUnmount() {
		this.componentCleanup();
		window.removeEventListener("beforeunload", this.componentCleanup);
	}

	componentCleanup() {
		if (this.state.db) {
			clearGuestTasks(this.state.db);
			this.state.db.close();
		}
	}

	render() {
		return (
			<div className="app-container">
				<Header
					user={this.state.user}
					login={this.handleLoginClick}
					logout={this.handleLogoutClick}
				/>
				<ContentContainer
					user={this.state.user}
					type={this.state.tab}
					db={this.state.db}
					switchTab={this.makeTabUpdater}
				/>
				<div className="footer">
					Made by me
				</div>
			</div>
		);
	}

	handleLoginClick() {
		// TODO: modal for selecting profile
		this.setState({
			user: {
				name: "Productivity Boss",
			},
		});
	}

	handleLogoutClick() {
		// TODO: modal for logging out
		this.setState({
			user: null,
		});
	}

	makeTabUpdater(newValue) {
		return function() {
			this.handleTabSwitch(newValue);
		}.bind(this);
	}

	handleTabSwitch(newTab) {
		this.setState({
			tab: newTab,
		});
	}
}

// --- Functions ---
function arraysAreSame(arr1, arr2) {
	if (arr1.length !== arr2.length) { return false; }
	return arr1.every((value, index) => {
		return value === arr2[index];
	});
}

// --- Render ---
ReactDOM.render(
	<App />,
	document.getElementById('root')
);
