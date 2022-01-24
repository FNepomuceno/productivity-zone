import React from 'react';

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

    handleChangeDesc(event) {
        this.setState({ description: event.target.value });
    }

    handleChangeDate(event) {
        this.setState({ dueDate: new Date(event.target.value) });
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
                <label htmlFor='task-desc'>Description</label>
                <input name='task-desc' type='text' onChange={this.handleChangeDesc} /><br />
                <label htmlFor='due-date'>Due Date</label>
                <input name='due-date' type='date' min={todayString()}
                    onChange={this.handleChangeDate} /><br />
                <input name='submit' type='submit' value='Submit' />
                <input name='cancel' type='button' value='Cancel' onClick={this.handleCancel} />
            </form>
        );
    }
}

// --- Functions ---
function todayString() {
    return new Date().toLocaleDateString('en-ca');
}

export default CreateForm;
