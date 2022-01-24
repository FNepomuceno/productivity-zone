import React from 'react';

import Header from './Header.js';
import ContentContainer from './ContentContainer.js';
import TabSelector from './TabSelector.js';
import TasksApp from './TasksApp.js';

import {
    addUser,
    removeUser,
    getUser,
} from './cookie.js';

import {
    startDB,
    clearGuestTasks,
} from './database.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleLoginClick = this.handleLoginClick.bind(this);
        this.handleLogoutClick = this.handleLogoutClick.bind(this);
        this.handleTabSwitch = this.handleTabSwitch.bind(this);
        this.makeTabUpdater = this.makeTabUpdater.bind(this);
        this.componentCleanup = this.componentCleanup.bind(this);
        this.state = {
            user: null,
            tab: "Tasks",
            db: null,
        };
    }

    componentDidMount() {
        if (!window.indexedDB) {
            console.error("Could not set up database");
        }

        // Set up cookie
        const userInfo = getUser();
        let username;
        if (userInfo && userInfo['name']) {
            username = userInfo['name'];
        }
        let user = username? { name: username }: null;

        this.setState({
            user: user,
        });

        // Set up database
        const updateDBstate = (event) => {
            this.setState({
                db: event.target.result,
            });
        }

        startDB(updateDBstate);

        window.addEventListener("beforeunload", this.componentCleanup);
    }

    componentDidUpdate() {
        if (this.state.user) {
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

    handleLoginClick() {
        // TODO: modal for selecting profile
        const username = 'Productivity Boss';
        addUser(username);

        this.setState({
            user: {
                name: username,
            },
        });
    }

    handleLogoutClick() {
        // TODO: modal for logging out
        removeUser();

        this.setState({
            user: null,
        });
    }

    makeTabUpdater(newValue) {
        return function() {
            this.handleTabSwitch(newValue);
        }.bind(this);
    }

    handleTabSwitch(newTab) {
        this.setState({
            tab: newTab,
        });
    }

    render() {
        let types = ['Tasks', 'Timer'];
        let typeMap = {
            'Tasks': <TasksApp db={this.state.db} user={this.state.user} />,
            'Timer': <p>Timer App coming soon!</p>,
        };

        let content = typeMap[this.state.tab] || <p>Choose an app above</p>;

        return (
            <div className="app-container">
                <Header
                    user={this.state.user}
                    login={this.handleLoginClick}
                    logout={this.handleLogoutClick}
                />
                <ContentContainer>
                    <TabSelector switchTab={this.makeTabUpdater}
                        type={this.state.tab} types={types} />
                    {content}
                </ContentContainer>
                <div className="footer">
                    Made by me
                </div>
            </div>
        );
    }
}

export default App;
