import { createContext } from 'react'

const AppContext = createContext({
	accountData: undefined,
	selectedProfile: 0,
	setSelectedProfile: () => {},
	profiles: [],
	currentUser: undefined,
	currentUserLoading: false,
	currentUserError: undefined
})

export default AppContext
