import React from 'react';

import Modal from './Modal.js';
import TaskItem from './TaskItem.js';
import CreateForm from './form/CreateForm.js';
import EditForm from './form/EditForm.js';

import {
    addTask,
    getTasks,
    updateTask,
} from './database.js';

class TasksApp extends React.Component {
    constructor(props) {
        super(props);
        this.handleNewTask = this.handleNewTask.bind(this);
        this.handleEditTask = this.handleEditTask.bind(this);
        this.handleCreateTask = this.handleCreateTask.bind(this);
        this.handleUpdateTask = this.handleUpdateTask.bind(this);
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
        if (!this.props.db) { return; }

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

    handleEditTask() {
        this.setState({
            mode: 'Editing',
        });
    }

    handleUpdateTask(data) {
        if (!data) {
            this.updateTasks();
            return;
        }

        updateTask(this.props.db, data.taskID, data.values);

        this.updateTasks();
    }

    toggleTaskFinished(value) {
        updateTask(this.props.db, value.taskID, { completed: value.completed });
        this.updateTasks();
    }

    render() {
        let taskList = <p>Make a new task by clicking "New task" above</p>;
        if (this.state.tasks.length > 0) {
            taskList = (
                <div>
                    <p>Here are your tasks to do:</p>
                    <ul>
                        {this.state.tasks.map(task => (
                            <TaskItem task={task} key={task.timeCreated}
                                onChange={this.toggleTaskFinished} />
                        ))}
                    </ul>
                </div>
            );
        }

        return (
            <div>
                <button onClick={this.handleNewTask}>New task</button> &nbsp;
                <button onClick={this.handleEditTask}>Edit tasks</button> <br />
                {taskList}
                <Modal show={this.state.mode === 'Creating'}>
                    <h3>New task</h3><hr />
                    <CreateForm handleResult={this.handleCreateTask} />
                </Modal>
                <Modal show={this.state.mode === 'Editing'}>
                    <h3>Edit task</h3><hr />
                    <EditForm tasks={this.state.tasks} handleResult={this.handleUpdateTask} />
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
