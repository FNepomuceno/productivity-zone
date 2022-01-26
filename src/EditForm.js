import React from 'react';

import TaskDetail from './TaskDetail.js';

class EditForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleSwitch = this.handleSwitch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleResult = (
            (this.props.handleResult)?
            this.props.handleResult:
            (() => {})
        );

        this.state = this.stateObj(this.props.tasks.find(()=>true));

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

    stateObj(task) {
        if (!task) {
            return {};
        }

        return {
            taskID: task.timeCreated,
            values: {
                textDesc: task.textDesc,
                dueDate: task.dueDate,
                completed: task.completed,
            },
        };
    }

    handleSwitch(event) {
        const taskID = event.target.value;

        this.setState(this.stateObj(this.props.tasks.find(o => o.timeCreated == taskID)));
    }

    handleChange(value) {
        this.setState({
            values: value,
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        this.handleResult(this.state);
    }

    handleCancel() {
        this.handleResult(null);
    }

    render() {
        // TODO: extract taskDetail as component

        return (
            <form action='#' onSubmit={this.handleSubmit} >
                <label htmlFor='task-select'>Select Task</label>
                <select name='task-select' onChange={this.handleSwitch}>
                    {this.taskItems}
                </select><br />
                <TaskDetail task={this.state.values} onChange={this.handleChange} />
                <input name='submit' type='submit' value='Submit' />
                <input name='cancel' type='button' value='Cancel' onClick={this.handleCancel} />
            </form>
        );
    }
}

export default EditForm;
