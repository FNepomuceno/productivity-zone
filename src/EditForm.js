import React from 'react';

import TextInput from './TextInput.js';

class EditForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleChangeTask = this.handleChangeTask.bind(this);
        this.handleChangeDesc = this.handleChangeDesc.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeFinished = this.handleChangeFinished.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleResult = (
            (this.props.handleResult)?
            this.props.handleResult:
            (() => {})
        );

        this.state = {
            changedTask: (!this.props.tasks.length)? null: taskObj(this.props.tasks[0]),
        };

        // The tasks should not change while this form is active,
        //   so the tasks prop should be fine to use here
        this.taskItems = this.props.tasks.map((task) => {
            return (
                <option key={task.timeCreated} value={task.timeCreated}>
                    {task.textDesc}
                </option>
            );
        });
    }

    handleChangeTask(event) {
        const taskID = event.target.value;

        let newTask;
        for (let task of this.props.tasks) {
            if (task.timeCreated === taskID) {
                newTask = taskObj(task);
                break;
            }
        }

        this.setState({ changedTask: newTask });
    }

    handleChangeDesc(value) {
        let newTask = this.state.changedTask;
        newTask.description = value;
        this.setState({ changedTask: newTask });
    }

    handleChangeDate(event) {
        let newTask = this.state.changedTask;
        newTask.dueDate = event.target.value;
        this.setState({ changedTask: newTask });
    }

    handleChangeFinished(event) {
        let newTask = this.state.changedTask;
        newTask.finished = event.target.checked;
        this.setState({ changedTask: newTask });
    }

    handleSubmit(event) {
        event.preventDefault();

        const result = {
            textDesc: this.state.changedTask.description,
            dueDate: dateObj(this.state.changedTask.dueDate),
            completed: this.state.changedTask.finished,
            taskID: this.state.changedTask.taskID,
        };

        this.handleResult(result);
    }

    handleCancel() {
        const result = null;

        this.handleResult(result);
    }

    render() {
        // TODO: extract taskDetail as component
        let taskDetail = (!this.state.changedTask)? <p>No tasks to edit!</p>: (
            <div>
                <TextInput
                    label='Description'
                    name='task-desc'
                    value={this.state.changedTask.description}
                    onChange={this.handleChangeDesc}
                />
                <label htmlFor='due-date'>Due Date</label>
                <input
                    name='due-date'
                    type='date'
                    value={this.state.changedTask.dueDate}
                    min={todayString()}
                    onChange={this.handleChangeDate}
                /><br />
                <label htmlFor='task-finished'>Task Finished</label>
                <input
                    name='finished'
                    type='checkbox'
                    checked={this.state.changedTask.finished}
                    onChange={this.handleChangeFinished}
                /><br />
            </div>
        );

        return (
            <form action='#' onSubmit={this.handleSubmit} >
                <label htmlFor='task-select'>Select Task</label>
                <select name='task-select' onChange={this.handleChangeTask}>
                    {this.taskItems}
                </select><br />
                {taskDetail}
                <input name='submit' type='submit' value='Submit' />
                <input name='cancel' type='button' value='Cancel' onClick={this.handleCancel} />
            </form>
        );
    }
}

// --- Functions ---
function dateString(date) {
    return date.toLocaleDateString('en-ca');
}

function todayString() {
    return new Date().toLocaleDateString('en-ca');
}

function taskObj(task) {
    return {
        description: task.textDesc,
        dueDate: dateString(task.dueDate),
        finished: task.completed,
        taskID: task.timeCreated,
    }
}

function dateObj(dateStr) {
    const utcDate = new Date(dateStr);
    const result = new Date(utcDate.getTime() + (60000 * utcDate.getTimezoneOffset()));

    return result;
}

export default EditForm;
