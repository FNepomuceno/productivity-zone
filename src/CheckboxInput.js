function CheckboxInput(props) {
    function handleChange(event) {
        const value = event.target.checked;

        props.onChange && props.onChange(value);
    }

    return (
        <div>
            <label htmlFor={props.name}>{props.label}</label>
            <input
                name={props.name}
                type='checkbox'
                checked={props.value}
                onChange={handleChange}
            />
        </div>
    );
}

export default CheckboxInput;
