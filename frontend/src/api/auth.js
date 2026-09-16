import axiosInstance from './axiosInstance'

export const login = async (credentials) => {
	const { data } = await axiosInstance.post('/auth/login', credentials)
	return data
}

export const loginWithGoogle = async (idToken) => {
	const { data } = await axiosInstance.post('/auth/google', { idToken })
	return data
}

export const signup = async (credentials) => {
	const { data } = await axiosInstance.post('/auth/register', credentials)
	return data
}

export const getUser = async () => {
	const { data } = await axiosInstance.get('/auth/profile')
	return data
}

export const logout = async () => {
	const { data } = await axiosInstance.post('/auth/logout')
	return data
}
export { axiosInstance }