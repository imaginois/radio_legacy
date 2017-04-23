function logInfo(o) {
	console.info(o);
}

function logWarn(o) {
	console.warn(o);
}

function logError(o) {
	console.error(o);
}

function dd(o) {
	console.log(o);
}

var log = {
	info : logInfo,
	warn : logWarn,
	error: logError,
}