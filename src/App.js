import React from 'react';

import Header from './Header.js';
import ContentContainer from './ContentContainer.js';

import {
	addUser,
	removeUser,
	getUser,
} from './cookie.js';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.handleLoginClick = this.handleLoginClick.bind(this);
		this.handleLogoutClick = this.handleLogoutClick.bind(this);
		this.handleTabSwitch = this.handleTabSwitch.bind(this);
		this.makeTabUpdater = this.makeTabUpdater.bind(this);
		this.state = {
			user: null,
			tab: "Tasks",
		};
	}

	componentDidMount() {
		if (!window.indexedDB) {
			console.error("Could not set up database");
		}
			const userInfo = getUser();
			let username;
			if (userInfo && userInfo['name']) {
				username = userInfo['name'];
			}
			let user = username? { name: username }: null;

			this.setState({
				user: user,
			});
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
		const username = 'Productivity Boss';
		addUser(username);

		this.setState({
			user: {
				name: username,
			},
		});
	}

	handleLogoutClick() {
		// TODO: modal for logging out
		removeUser();

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

export default App;
