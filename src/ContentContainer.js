import React from 'react';

import TasksApp from './TasksApp.js';
import TabSelector from './TabSelector.js';

import {
	startDB,
	clearGuestTasks,
} from './database.js';

class ContentContainer extends React.Component {
	constructor(props) {
		super(props);
		this.default = <p>Choose an app above</p>;
		this.componentCleanup = this.componentCleanup.bind(this);
		this.state = {
			db: null,
		};
	}

	componentDidMount() {
		const updateDBstate = (event) => {
			this.setState({
				db: event.target.result,
			});
		}

		startDB(updateDBstate);

		window.addEventListener("beforeunload", this.componentCleanup);
	}

	componentDidUpdate() {
		if (this.props.user) {
			clearGuestTasks(this.state.db);
		}
	}

	componentWillUnmount() {
		this.componentCleanup();
		window.removeEventListener("beforeunload", this.componentCleanup);
	}

	componentCleanup() {
		if (this.state.db) {
			clearGuestTasks(this.state.db);
			this.state.db.close();
		}
	}

	render() {
		let typePairs = [
			["Tasks", <TasksApp db={this.state.db} user={this.props.user} />],
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

		let content = this.default;
		for (let i in types) {
			if (types[i] === this.props.type) {
				content = apps[i];
				break;
			}
		}

		return (
			<div className="container">
				<div className="col-filler" />
				<div className="content">
					<TabSelector switchTab={this.props.switchTab}
						type={this.props.type} types={types} />
					{content}
				</div>
				<div className="col-filler" />
			</div>
		);
	}
}

export default ContentContainer;
