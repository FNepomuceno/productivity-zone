import TitleDisplay from './TitleDisplay.js';
import ProfileInfo from './ProfileInfo.js';

function Header(props) {
    return (
        <div className="header">
            <TitleDisplay />
            <ProfileInfo
                user={props.user}
                login={props.login}
                logout={props.logout}
            />
        </div>
    );
}

export default Header;
