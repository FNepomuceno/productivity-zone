// TODO: remember to change from testing duration to default of 10 minutes
const SESSION_TIME = 30; // 0.5 minutes

function addSeconds(date, numSeconds) {
	return new Date(date.getTime() + (numSeconds * 1000));
}

function sessionTimeString() {
	return addSeconds(new Date(), SESSION_TIME).toUTCString();
}

function addUser(username) {
	let contents = {
		username: username,
		expires: sessionTimeString(),
		path: '/',
	};

	if (username) {
		createCookie(contents);
	}
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
	getUser,
};
