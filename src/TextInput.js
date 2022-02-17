import React from 'react';

function TextInput(props) {
    function handleChange(event) {
        const value = event.target.value;

        props.onChange && props.onChange(value);
    }

    return (
        <div>
            <label htmlFor={props.name}>{props.label}</label>
            <input
                name={props.name}
                type='text'
                value={props.value}
                onChange={handleChange}
            />
        </div>
    );
}

export default TextInput;
