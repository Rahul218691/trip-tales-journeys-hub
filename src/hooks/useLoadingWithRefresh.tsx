import { useEffect, useState, useContext } from 'react';
import { toast } from "sonner";
import { SET_USER_INFO, LOCALSTORAGE_KEYS } from '@/lib/constants';
import { AuthContext } from '../context/AuthContext';
import { logout } from '../services/auth';
import { LoginResponse } from '@/types/auth';
import axios, { AxiosHeaders } from 'axios';

const useLoadingWithRefresh = () => {
    const { dispatch } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const refreshToken = async () => {
            try {
                if (window.localStorage.getItem(LOCALSTORAGE_KEYS.AUTHENTICATED) === 'true') {
                    const headers = new AxiosHeaders();
                    headers.set('X-Request_Source', import.meta.env.VITE_CLIENT_URL);
                    const response = await axios.get<LoginResponse>(`${import.meta.env.VITE_API_SERVER_BASE_URL}/api/refreshToken`, {
                        withCredentials: true,
                        headers
                    });
                    dispatch({
                        type: SET_USER_INFO,
                        payload: response.data
                    });
                }
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'An error occurred');
                await logout();
                dispatch({
                    type: SET_USER_INFO,
                    payload: { user: null, auth: false }
                });
            } finally {
                setLoading(false);
            }
        };

        refreshToken();
    }, [dispatch]);

    return { loading };
};

export default useLoadingWithRefresh;