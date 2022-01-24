function ProfileInfo(props) {
    let user = props.user;

    if (user) {
        return (
            <div className="profile-info noselect">
                <p>Welcome, {props.user.name}.</p>
                <p>
                    <span className="login-text" onClick={props.logout}>Logout</span>
                    &nbsp;to switch profiles
                </p>
            </div>
        );
    }

    return (
        <div className="profile-info noselect">
            <p>Welcome, guest.</p>
            <p>
                <span className="login-text" onClick={props.login}>Login</span>
                &nbsp;to save stats
            </p>
        </div>
    );
}

export default ProfileInfo;
