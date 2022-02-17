const SESSION_TIME = 10 * 60;

function addSeconds(date, numSeconds) {
    return new Date(date.getTime() + (numSeconds * 1000));
}

function sessionTimeString(sessDuration) {
    sessDuration = sessDuration? sessDuration: SESSION_TIME;
    return addSeconds(new Date(), sessDuration).toUTCString();
}

function setUser(username, expires) {
    let contents = {
        username: username,
        expires: expires,
        path: '/',
    };

    createCookie(contents);
}

function addUser(user) {
    const username = user?.name;
    const expires = user?.exp?.toUTCString() || sessionTimeString();

    if (username) {
        setUser(username, expires);
    }
}

function removeUser() {
    setUser('', -1);
}

function createCookie(data) {
    const cookieText = Object.entries(data)
        .map((entry) => {
            const [key, value] = entry;
            return `${key}=${value}`;
        })
        .reduce((prevVal, curVal) => {
            return `${prevVal}; ${curVal}`;
        });

    document.cookie = cookieText;
}

function parseCookie(strData) {
    const result = strData.split('; ')
        .map((entry) => {
            return entry.split('=');
        })
        .reduce((resObj, nxtEntry) => {
            const [key, value] = nxtEntry;
            resObj[key] = value;
            return resObj;
        }, {});

    return result;
}

function getUser() {
    const cookie = document.cookie;

    if (cookie) {
        const cookieData = parseCookie(cookie);

        if (cookieData['username']) {
            return {
                name: cookieData['username'],
            };
        }
    }

    return null;
}

export {
    addUser,
    removeUser,
    getUser,
};
