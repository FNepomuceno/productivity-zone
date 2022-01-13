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
		this.updateTasks = this.updateTasks.bind(this);
		this.state = { tasks: [] };
	}

	componentDidMount() {
		const db = this.props.db;
		if (db) {
			this.updateTasks();
		}
	}

	componentDidUpdate(previousProps, previousState) {
		const dbSet = this.props.db && !previousProps.db;
		const tasksChanged = arraysAreSame(this.state.tasks, previousState.tasks);

		if (dbSet || tasksChanged) {
			this.updateTasks();
		}
	}

	updateTasks() {
		const handleTasks = (tasks) => {
			if (!tasks) {
				tasks = [];
			}

			this.setState({
				tasks: tasks,
			});
		}

		getTasks(this.props.db, this.props.user, handleTasks);
	}

	handleNewTask() {
		// TODO: create form in modal for creating new task
		let textDesc = "Create a task";
		let user = GUEST_NAME;
		let dueDate = new Date();
		let db = this.props.db;

		addTask(db, dueDate, textDesc, user);
		this.updateTasks();
	}

	render() {
		let taskItems = this.state.tasks.map((task, index) => {
			return (
				// TODO: make key be "creation time"
				<li className="task-item" key={index}>
					<input type="checkbox" /> &nbsp;
					{task.textDesc}
				</li>
			);
		});

		let taskList = <p>Make a new task by clicking "New task" above</p>;
		if (taskItems.length > 0) {
			taskList = (
				<div>
					<p>Here are your tasks to do:</p>
					<ul>
						{taskItems}
					</ul>
				</div>
			);
		}

		return (
			<div>
				<button onClick={this.handleNewTask}>New task</button> &nbsp;
				<button>Edit tasks</button> <br />
				{taskList}
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

			let handleClick = this.props.switchTab(optType);

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

// --- Constants ---
const GUEST_NAME = "[Guest]";

// --- Functions ---
function startDB(handleSuccess) {
	const request = indexedDB.open("ProductivityZone", 1);
	request.onerror = (event) => {
		console.error(`Database error: ${event.target.errorCode}`);
	};

	request.onsuccess = handleSuccess;

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
	query.onsuccess = (event) => {};

	query.onerror = (event) => {
		console.error(`Transaction error: ${event.target.errorCode}`);
	};
}

function getTasks(db, user, handleTasks, onlyUnfinished) {
	const userName = user? user.name: GUEST_NAME;
	const transaction = db.transaction("TaskList", "readonly");
	const store = transaction.objectStore("TaskList");
	onlyUnfinished = !!onlyUnfinished;

	let userIndex = store.index("user");
	let result = [];

	userIndex.openCursor().onsuccess = (event) => {
		let cursor = event.target.result;

		if (cursor && cursor.value.user === userName) {
			const usernameMatches = cursor.value.user === userName;
			const isVisible = !(onlyUnfinished && cursor.value.completed);

			if (userNameMatches && isVisible) {
				result.push(cursor.value);
			}
			cursor.continue();
		} else {
			handleTasks(result);
		}
	}
}

function clearGuestTasks(db) {
	const transaction = db.transaction("TaskList", "readwrite");
	const store = transaction.objectStore("TaskList");

	store.openCursor().onsuccess = (event) => {
		let cursor = event.target.result;
		if (cursor) {
			if (cursor.value.user === GUEST_NAME) {
				store.delete(cursor.primaryKey);
			}
			cursor.continue();
		}
	}
}

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
