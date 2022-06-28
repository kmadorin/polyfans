const consoleLog = (title, color, message) => {
	console.log(`%c[${title}]`, `color: ${color}; font-weight: bolder;`, message)
}

export default consoleLog
