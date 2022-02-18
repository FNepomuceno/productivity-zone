import React from 'react';

import Header from './Header.js';
import TitleDisplay from './TitleDisplay.js';
import ProfileInfo from './ProfileInfo.js';

import ContentContainer from './ContentContainer.js';
import TabSelector from './TabSelector.js';

import TasksApp from './apps/TasksApp.js';
import TimerApp from './apps/TimerApp.js';

import {
    addUser,
    removeUser,
    getUser,
} from './cookie.js';

import {
    startDB,
    clearGuestTasks,
} from './database.js';

import './App.css';

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
        if (this.state.user && this.state.db) {
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

    handleLoginClick(response) {
        let b64url = response.credential.split('.')[1];
        let b64 = b64url.replace(/-/g, '').replace(/_/g, '/');
        let tText = decodeURIComponent(escape(window.atob(b64)));
        let token = JSON.parse(tText);
        let user = {
            name: token.name,
            g_id: token.sub,
            login: new Date(token.iat * 1000),
            exp: new Date(token.exp * 1000),
        }

        this.setState({
            user,
        }, () => {
            addUser(user);
        });
    }

    handleLogoutClick() {
        this.setState({
            user: null,
        }, () => {
            removeUser();
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
        };

        let content = typeMap[this.state.tab];
        if (!content && this.state.tab !== 'Timer') {
            content = <p>Choose an app above</p>;
        }

        return (
            <div className="app-container">
                <Header>
                    <TitleDisplay />
                    <ProfileInfo
                        user={this.state.user}
                        login={this.handleLoginClick}
                        logout={this.handleLogoutClick}
                    />
                </Header>
                <ContentContainer>
                    <TabSelector switchTab={this.makeTabUpdater}
                        type={this.state.tab} types={types} />
                    {content}
                    <TimerApp visible={this.state.tab === 'Timer'} />
                </ContentContainer>
                <div className="footer">
                    Made by me
                </div>
            </div>
        );
    }
}

export default App;
