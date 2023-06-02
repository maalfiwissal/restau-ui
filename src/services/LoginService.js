import axios from 'axios';

const RESTAU_API_BASE_URL = "https://restau-api.onrender.com/users/login";

class LoginService {

    authenticate (email, password) {
        return axios.post(RESTAU_API_BASE_URL, {email: email, password: password});
    }
}

export default new LoginService()