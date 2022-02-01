import React from 'react';

import ScriptLoader from './ScriptLoader.js';

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.initializeRender = this.initializeRender.bind(this);
        this.loadScript = this.loadScript.bind(this);

        this.tag = React.createRef();
        this.script = new ScriptLoader().value;

        this.state = {
            status: 'Starting',
            error: undefined,
            result: undefined,
        };
    }

    componentDidMount() {
        this.setState({'status': 'Pending'}, () => {
            this.loadScript();
        });
    }

    componentDidUpdate() {
        if (this.state.status === 'Loaded') {
            this.initializeRender(this.state.result);
        }
    }

    loadScript() {
        this.script.then((e) => {
            this.setState({
                'status': 'Loaded',
                'result': e,
            });
        }).catch((e) => {
            this.setState({
                'status': 'Error',
                'error': e,
            });
        });
    }

    initializeRender(google) {
        google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: this.props.handleCredentialResponse,
        });

        google.accounts.id.renderButton(
            this.tag.current,
            { theme: 'outline', size: 'large' }
        );
    }

    render() {
        return (
            (this.state.status === 'Loaded')? <div ref={this.tag}></div>: null
        );
    }
}

export default SignIn;
