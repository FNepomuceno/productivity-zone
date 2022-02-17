function DateInput(props) {
    function dateString(date) {
        return date.toLocaleDateString('en-ca');
    }

    function dateObj(dateStr) {
        const utcDate = new Date(dateStr);
        const result = new Date(utcDate.getTime() + (60000 * utcDate.getTimezoneOffset()));

        return result;
    }

    function handleChange(event) {
        const value = dateObj(event.target.value);

        props.onChange && props.onChange(value);
    }

    return (
        <div>
            <label htmlFor={props.name}>{props.label}</label>
            <input
                name={props.name}
                type='date'
                value={dateString(props.value)}
                onChange={handleChange}
            />
        </div>
    );
}

export default DateInput;
