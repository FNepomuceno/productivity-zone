import './TaskItem.css';

function TaskItem(props) {
    function handleChange(event) {
        const value = {
            taskID: props.task.timeCreated,
            completed: event.target.checked,
        };

        props.onChange && props.onChange(value);
    }

    return (
        <li className="task-item">
            <input
                type="checkbox"
                checked={props.task.completed}
                onChange={handleChange}
            />&nbsp;
            {props.task.textDesc}
        </li>
    );
}

export default TaskItem;
