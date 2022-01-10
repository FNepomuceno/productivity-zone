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
						<span className="login-text" onClick={this.props.logout}>Logout</span>
						&nbsp;to switch profiles
					</p>
				</div>
			);
		}

		return (
			<div className="profile-info">
				<p>Welcome, guest.</p>
				<p>
					<span className="login-text" onClick={this.props.login}>Login</span>
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
	constructor(props) {
		super(props);

		this.default = <p>Choose an app above</p>;
		let typePairs = [
			["Tasks", <p>Tasks App under construction</p>],
			["Timer", <p>Timer App under construction</p>],
		];

		this.types = typePairs.reduce((lst, entry) => {
			lst.push(entry[0]);
			return lst;
		}, []);

		this.apps = typePairs.reduce((lst, entry) => {
			lst.push(entry[1]);
			return lst;
		}, []);
	}

	render() {
		let type;
		let content = this.default;

		for (let i in this.types) {
			if (this.types[i] === this.props.type) {
				type = this.types[i];
				content = this.apps[i];
				break;
			}
		}

		let options = this.types.map((optType) => {
			let classes = "tab-option";
			if (optType === type) { classes = classes + " tab-selected"; }

			return <div className={classes} key={optType}><h2>{optType}</h2></div>;
		});

		return (
			<div className="container">
				<div className="col-filler" />
				<div className="content">
					<div className="tab-selector">
						{options}
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
