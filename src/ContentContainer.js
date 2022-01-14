import React from 'react';

import TasksApp from './TasksApp.js';

class ContentContainer extends React.Component {
	constructor(props) {
		super(props);
		this.default = <p>Choose an app above</p>;
	}

	render() {
		let typePairs = [
			["Tasks", <TasksApp db={this.props.db} user={this.props.user} />],
			["Timer", <p>Timer App under construction</p>],
		];

		let types = typePairs.reduce((lst, entry) => {
			lst.push(entry[0]);
			return lst;
		}, []);

		let apps = typePairs.reduce((lst, entry) => {
			lst.push(entry[1]);
			return lst;
		}, []);

		let type;
		let content = this.default;

		for (let i in types) {
			if (types[i] === this.props.type) {
				type = types[i];
				content = apps[i];
				break;
			}
		}

		let options = types.map((optType) => {
			let classes = "tab-option noselect";
			if (optType === type) { classes = classes + " tab-selected"; }

			let handleClick = this.props.switchTab(optType);

			return (
				<div className={classes} key={optType} onClick={handleClick}>
					<h2>{optType}</h2>
				</div>
			);
		});

		return (
			<div className="container">
				<div className="col-filler" />
				<div className="content">
					<div className="tab-selector">
						{options}
					</div>
					{content}
				</div>
				<div className="col-filler" />
			</div>
		);
	}
}

export default ContentContainer;
