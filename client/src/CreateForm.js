import React from 'react';

import TextInput from './TextInput.js';
import DateInput from './DateInput.js';

class CreateForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleChangeDesc = this.handleChangeDesc.bind(this);
        this.handleChangeDate = this.handleChangeDate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleResult = (
            (this.props.handleResult)?
            this.props.handleResult:
            (() => {})
        );

        this.state = {
            description: '',
            dueDate: new Date(),
        };
    }

    handleChangeDesc(value) {
        this.setState({ description: value });
    }

    handleChangeDate(value) {
        this.setState({ dueDate: value });
    }

    handleSubmit(event) {
        event.preventDefault();

        const result = {
            description: this.state.description,
            dueDate: this.state.dueDate,
        };

        this.handleResult(result);
    }

    handleCancel() {
        const result = null;

        this.handleResult(result);
    }

    render() {
        return (
            <form action='#' onSubmit={this.handleSubmit} >
                <TextInput
                    label='Description'
                    name='task-desc'
                    value={this.state.description}
                    onChange={this.handleChangeDesc}
                />
                <DateInput
                    label='Due Date'
                    name='due-date'
                    value={this.state.dueDate}
                    onChange={this.handleChangeDate}
                />
                <input name='submit' type='submit' value='Submit' />
                <input name='cancel' type='button' value='Cancel' onClick={this.handleCancel} />
            </form>
        );
    }
}

export default CreateForm;
