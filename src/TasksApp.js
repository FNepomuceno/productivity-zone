import React from 'react';

import Modal from './Modal.js';
import CreateForm from './CreateForm.js';

import {
	addTask,
	getTasks,
	updateTask,
} from './database.js';

class TasksApp extends React.Component {
	constructor(props) {
		super(props);
		this.handleNewTask = this.handleNewTask.bind(this);
		this.handleCreateTask = this.handleCreateTask.bind(this);
		this.updateTasks = this.updateTasks.bind(this);
		this.toggleTaskFinished = this.toggleTaskFinished.bind(this);

		this.state = {
			tasks: [],
			mode: "Viewing",
		};
	}

	componentDidMount() {
		const db = this.props.db;
		if (db) {
			this.updateTasks();
		}
	}

	componentDidUpdate(previousProps, previousState) {
		const dbSet = this.props.db && !previousProps.db;
		const tasksChanged = !tasksAreSame(this.state.tasks, previousState.tasks);
		const userChanged = (
			!this.props.user !== !previousProps.user ||
			(!!this.props.user && this.props.user.name !== previousProps.user.name)
		);

		if (dbSet || tasksChanged || userChanged) {
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
				mode: 'Viewing',
			});
		}

		getTasks(this.props.db, this.props.user, handleTasks);
	}

	handleNewTask() {
		this.setState({
			mode: 'Creating',
		});
	}

	handleCreateTask(data) {
		if (!data) {
			this.updateTasks();
			return;
		}

		let textDesc = data.description;
		let user = (this.props.user)? this.props.user.name: null;
		let dueDate = data.dueDate;
		let db = this.props.db;

		addTask(db, dueDate, textDesc, user);
		this.updateTasks();
	}

	toggleTaskFinished(event) {
		// TODO: implement
		let taskID = event.target.name;
		let isFinished = event.target.checked;

		updateTask(this.props.db, taskID, { completed: isFinished });
		this.updateTasks();
	}

	render() {
		let taskItems = this.state.tasks.map((task, index) => {
			return (
				// TODO: make list item its own component
				<li className="task-item" key={task.timeCreated}>
					<input
						type="checkbox"
						name={task.timeCreated}
						checked={task.completed}
						onChange={this.toggleTaskFinished}
					/>&nbsp;
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
				<Modal show={this.state.mode === 'Creating'}>
					<h3>New task</h3><hr />
					<CreateForm handleResult={this.handleCreateTask} />
				</Modal>
			</div>
		);
	}
}

// --- Functions ---
function tasksAreSame(arr1, arr2) {
	if (arr1.length !== arr2.length) { return false; }
	return arr1.every((value1, index) => {
		const value2 = arr2[index];
		return (
			value1.completed === value2.completed &&
			value1.dueDate.getTime() === value2.dueDate.getTime() &&
			value1.textDesc === value2.textDesc
		);
	});
}

export default TasksApp;
