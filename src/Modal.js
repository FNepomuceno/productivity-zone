import React from 'react';

class Modal extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (!this.props.show) {
			return null;
		}

		return (
			<div className="modal">
				{this.props.children}
			</div>
		);
	}
}

export default Modal;
