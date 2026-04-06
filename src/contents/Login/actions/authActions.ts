import axios from "axios";
import { AppDispatch } from "recharts/types/state/store";
// REACT_APP_BACK_ADMIN_URL

export const login = async (username: string, password: string) => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BACK_ADMIN_URL}/api/auth/login`,
            {
                username,
                password
            }, { withCredentials:true});
        console.log("TOKEN: " + res.data.access_token);
        const { token } = res.data.access_token;

        localStorage.setItem('username',username);
        localStorage.setItem('token',res.data.access_token);
    } catch (error) {
        console.error(error);
    }
}