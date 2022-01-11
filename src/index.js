import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// --- Components ---
function TitleDisplay(props) {
	return (
		<h1 className="title-display noselect">Productivity Zone</h1>
	);
}

class ProfileInfo extends React.Component {
	render() {
		let user = this.props.user;

		if (user) {
			return (
				<div className="profile-info noselect">
					<p>Welcome, {this.props.user.name}.</p>
					<p>
						<span className="login-text" onClick={this.props.logout}>Logout</span>
						&nbsp;to switch profiles
					</p>
				</div>
			);
		}

		return (
			<div className="profile-info noselect">
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

class TasksApp extends React.Component {
	constructor(props) {
		super(props);

		this.handleNewTask = this.handleNewTask.bind(this);

		// TODO: Get tasks from cookie somehow instead of this
		this.tasks = [
			"Do laundry",
			"Go grocery shopping",
			"Pay bills",
		];
	}

	handleNewTask() {
		// TODO: create form in modal for creating new task
		let textDesc = "Create a task";
		let user = "[Guest]";
		let dueDate = new Date();
		let db = this.props.db;

		addTask(db, dueDate, textDesc, user);
	}

	render() {
		// TODO: make id be "creation time"
		let taskItems = this.tasks.map((task, index) => {
			return (
				<li className="task-item" key={index}>
					<input type="checkbox" /> &nbsp;
					{task}
				</li>
			);
		});

		// TODO: turn these into task items
		if (this.props.db) {
			getTasks(this.props.db, this.props.user);
		}

		return (
			<div>
				<p>Here are your tasks to do:</p>
				<ul>
					{taskItems}
				</ul>
				<button onClick={this.handleNewTask}>New task</button>
				<button>Edit tasks</button>
			</div>
		);
	}
}

class ContentContainer extends React.Component {
	constructor(props) {
		super(props);
		this.default = <p>Choose an app above</p>;
	}

	render() {
		let typePairs = [
			["Tasks", <TasksApp db={this.props.db} />],
			["Timer", <p>Timer App under construction</p>],
		];

		let types = typePairs.reduce((lst, entry) => {
			lst.push(entry[0]);
			return lst;
		}, []);

		let apps = typePairs.reduce((lst, entry) => {
			lst.push(entry[1]);
			return lst;
		}, []);

		let type;
		let content = this.default;

		for (let i in types) {
			if (types[i] === this.props.type) {
				type = types[i];
				content = apps[i];
				break;
			}
		}

		let options = types.map((optType) => {
			let classes = "tab-option noselect";
			if (optType === type) { classes = classes + " tab-selected"; }

			let handleClick = () => {
				return this.props.switch.call(this.props.ctx, optType);
			};

			return (
				<div className={classes} key={optType} onClick={handleClick}>
					<h2>{optType}</h2>
				</div>
			);
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
		this.handleTabSwitch = this.handleTabSwitch.bind(this);
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

		const request = indexedDB.open("ProductivityZone", 1);
		request.onerror = (event) => {
			console.error(`Database error: ${event.target.errorCode}`);
		};

		request.onsuccess = (event) => {
			console.log("Database initialized");
			this.setState({
				db: request.result,
			});
		};

		// First time setup
		request.onupgradeneeded = (event) => {
			let db = event.target.result;
			db.onerror = (event) => {
				console.error("Error loading database");
			}

			// Create object store
			let taskStore = db.createObjectStore("TaskList", { keyPath: "timeCreated" });
			taskStore.createIndex("dueDate", "dueDate", { unique: false });
			taskStore.createIndex("textDesc", "textDesc", { unique: false });
			taskStore.createIndex("user", "user", { unique: false });
			taskStore.createIndex("completed", "completed", { unique: false });
		};
	}

	componentWillUnmount() {
		if (this.state.db) {
			// TODO: clear guest tasks

			console.log("Closing database");
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
					switch={this.handleTabSwitch}
					ctx={this}
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

	handleTabSwitch(newTab) {
		this.setState({
			tab: newTab,
		});
	}
}

// --- Functions ---
function addTask(db, dueDate, textDesc, user) {
	let newItem = {
		timeCreated: new Date().toISOString(),
		dueDate: dueDate,
		textDesc: textDesc,
		user: user,
		completed: false,
	};

	const transaction = db.transaction("TaskList", "readwrite");
	const store = transaction.objectStore("TaskList");

	let query = store.put(newItem);
	query.onsuccess = (event) => {
		console.log(`Inserted new item: ${JSON.stringify(newItem)}`);
	};

	query.onerror = (event) => {
		console.error(`Transaction error: ${event.target.errorCode}`);
	};
}

function getTasks(db, user) {
	const userName = user? user.name: "[Guest]";
	const transaction = db.transaction("TaskList", "readonly");
	const store = transaction.objectStore("TaskList");

	let userIndex = store.index("user");
	let query = userIndex.getAll(userName);

	query.onsuccess = () => {
		console.log(query.result);
	};
}

// --- Render ---
ReactDOM.render(
	<App />,
	document.getElementById('root')
);
