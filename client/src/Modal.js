import React from 'react';
import './Modal.css';

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
                <div className="modal-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Modal;
