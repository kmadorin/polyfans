import omitDeep from 'omit-deep'

const omit = (object, name) => {
	return omitDeep(object, name)
}

export default omit
