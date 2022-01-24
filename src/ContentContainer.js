import React from 'react';
import './ContentContainer.css';

class ContentContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                <div className="col-filler" />
                <div className="content">
                    {this.props.children}
                </div>
                <div className="col-filler" />
            </div>
        );
    }
}

export default ContentContainer;
