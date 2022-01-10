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
		let user = this.props.user;

		if (user) {
			return (
				<div className="profile-info">
					<p>Welcome, {this.props.user.name}.</p>
					<p>
						<span class="login-text" onClick={this.props.logout}>Logout</span>
						&nbsp;to switch profiles
					</p>
				</div>
			);
		}

		return (
			<div className="profile-info">
				<p>Welcome, guest.</p>
				<p>
					<span class="login-text" onClick={this.props.login}>Login</span>
					&nbsp;to save stats
				</p>
			</div>
		);
	}
}

class Header extends React.Component {
	render() {
		return (
			<div className="header">
				<TitleDisplay />
				<ProfileInfo
					user={this.props.user}
					login={this.props.login}
					logout={this.props.logout}
				/>
			</div>
		);
	}
}

class ContentContainer extends React.Component {
	render() {
		let content = <p>Unknown Content</p>;

		// TODO: determine which component to load depending on a predetermined list
		if (this.props.type === "Tasks") {
			content = <p>Tasks App under construction</p>;
		} else if (this.props.type === "Timer") {
			content = <p>Timer App under construction</p>;
		}

		return (
			<div className="container">
				<div className="col-filler" />
				<div className="content">
					<div className="tab-selector">
						<div className="tab-option tab-selected"><h2>Tasks</h2></div>
						<div className="tab-option"><h2>Timer</h2></div>
					</div>
					{content}
				</div>
				<div className="col-filler" />
			</div>
		);
	}
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.handleLoginClick = this.handleLoginClick.bind(this);
		this.handleLogoutClick = this.handleLogoutClick.bind(this);
		this.state = {
			user: null,
			tab: "Tasks",
		};
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
		console.log("login?");
	}

	handleLogoutClick() {
		// TODO: modal for logging out
		this.setState({
			user: null,
		});
	}
}

// --- Functions ---

// --- Render ---
ReactDOM.render(
	<App />,
	document.getElementById('root')
);
