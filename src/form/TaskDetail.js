import React from 'react';

import TextInput from './TextInput.js';
import DateInput from './DateInput.js';
import CheckboxInput from './CheckboxInput.js';

class TaskDetail extends React.Component {
    constructor(props) {
        super(props);
        this.handleChangeDesc = this.handleChangeDesc.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleChangeFinished = this.handleChangeFinished.bind(this);
        this.sendChanges = this.sendChanges.bind(this);

        this.state = (this.props.task)? this.props.task: {};
    }

    handleChangeDesc(value) {
        this.setState({
            textDesc: value,
        }, this.sendChanges);
    }

    handleChangeDate(value) {
        this.setState({
            dueDate: value,
        }, this.sendChanges);
    }

    handleChangeFinished(value) {
        this.setState({
            completed: value,
        }, this.sendChanges);
    }

    sendChanges() {
        this.props.onChange && this.props.onChange(this.state);
    }

    render() {
        return (!this.state)? <p>No tasks to edit!</p>: (
            <div>
                <TextInput
                    label='Description'
                    name='task-desc'
                    value={this.state.textDesc}
                    onChange={this.handleChangeDesc}
                />
                <DateInput
                    label='Due Date'
                    name='due-date'
                    value={this.state.dueDate}
                    onChange={this.handleChangeDate}
                />
                <CheckboxInput
                    label='Task Finished'
                    name='finished'
                    value={this.state.completed}
                    onChange={this.handleChangeFinished}
                />
            </div>
        );
    }
}

export default TaskDetail;
