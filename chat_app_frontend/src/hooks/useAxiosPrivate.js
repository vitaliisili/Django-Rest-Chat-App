import axios, {axiosPrivate} from "../api/axios";
import {useEffect} from "react";
import useAuthService from "./useAuthService";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET

const useAxiosPrivate = () => {
    const authService = useAuthService()

    useEffect(() => {
        axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${authService?.getAccessToken()}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401) {
                    try {
                        const response = await axios.post('/auth/token/', {
                            grant_type: "refresh_token",
                            refresh_token: authService?.getRefreshToken(),
                            client_id: CLIENT_ID,
                            client_secret: CLIENT_SECRET,
                        })


                        const newAccessToken = response?.data?.access_token;
                        authService?.setAccessToken(newAccessToken)

                        const newRefreshToken = response?.data?.refresh_token;
                        authService?.setRefreshToken(newRefreshToken)

                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return axiosPrivate(prevRequest);

                    }catch (error) {
                        console.log('ERROR_WHEN_REFRESH_TOKEN_IN_INTERCEPTOR', error)
                    }

                }

                return Promise.reject(error);
            }
        );

    }, [])

    return axiosPrivate;
}

export default useAxiosPrivate;