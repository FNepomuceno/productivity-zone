import React from 'react';

import TextInput from './TextInput.js';
import DateInput from './DateInput.js';
import CheckboxInput from './CheckboxInput.js';

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

    handleChangeDate(value) {
        let newTask = this.state.changedTask;
        newTask.dueDate = value;
        this.setState({ changedTask: newTask });
    }

    handleChangeFinished(value) {
        let newTask = this.state.changedTask;
        newTask.finished = value;
        this.setState({ changedTask: newTask });
    }

    handleSubmit(event) {
        event.preventDefault();

        const result = {
            textDesc: this.state.changedTask.description,
            dueDate: this.state.changedTask.dueDate,
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
                <DateInput
                    label='Due Date'
                    name='due-date'
                    value={this.state.changedTask.dueDate}
                    onChange={this.handleChangeDate}
                />
                <CheckboxInput
                    label='Task Finished'
                    name='finished'
                    value={this.state.changedTask.finished}
                    onChange={this.handleChangeFinished}
                />
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
function taskObj(task) {
    return {
        description: task.textDesc,
        dueDate: task.dueDate,
        finished: task.completed,
        taskID: task.timeCreated,
    }
}

export default EditForm;
