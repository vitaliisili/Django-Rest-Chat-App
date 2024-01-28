const useAuthService = () => {
    const getAccessToken = () => localStorage.getItem('accessToken');
    const setAccessToken = (accessToken) => localStorage.setItem('accessToken', accessToken);
    const removeAccessToken = () => localStorage.removeItem('accessToken');
    const getRefreshToken = () => localStorage.getItem('refreshToken');
    const setRefreshToken = (refreshToken) => localStorage.setItem('refreshToken', refreshToken);
    const removeRefreshToken = () => localStorage.removeItem('refreshToken');
    const setUser = (user) => localStorage.setItem('user', JSON.stringify(user))
    const getUser = () => JSON.parse(localStorage.getItem('user'))
    const removeUser = () => localStorage.removeItem('user')

    const isAuthenticated = () => {
        const accessToken = getAccessToken();
        return accessToken !== null && accessToken !== undefined;
    };

    const logout = () => {
        removeAccessToken()
        removeRefreshToken()
        removeUser()
    }

    return {
        getAccessToken,
        setAccessToken,
        removeAccessToken,
        getRefreshToken,
        setRefreshToken,
        removeRefreshToken,
        setUser,
        getUser,
        removeUser,
        logout,
        isAuthenticated,
    }
}

export default useAuthService