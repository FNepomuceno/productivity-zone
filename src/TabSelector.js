import './TabSelector.css';

function TabSelector(props) {
	let options = props.types.map((optType) => {
		let classes = "tab-option noselect";
		if (optType === props.type) { classes = classes + " tab-selected"; }

		let handleClick = props.switchTab(optType);

		return (
			<div className={classes} key={optType} onClick={handleClick}>
				<h2>{optType}</h2>
			</div>
		);
	});

	return (
		<div className="tab-selector">
			{options}
		</div>
	);
}

export default TabSelector;
