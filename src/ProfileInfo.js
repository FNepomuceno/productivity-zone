import './ProfileInfo.css';

import SignIn from './google/SignIn.js';

function ProfileInfo(props) {
    let user = props.user;

    if (user) {
        return (
            <div className="profile-info noselect">
                <p>Welcome, {props.user.name}.</p>
                <p>
                    <span className="login-text" onClick={props.logout}>
                        Click here to logout
                    </span>
                </p>
            </div>
        );
    }

    return (
        <div className="profile-info noselect">
            <SignIn handleCredentialResponse={props.login} />
        </div>
    );
}

export default ProfileInfo;
