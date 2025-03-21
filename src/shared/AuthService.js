import { jwtDecode } from 'jwt-decode';
import UserModel from '../model/UserModel';
import router from '../router';

class AuthService {
    constructor() {
        this.token = '';
        this.user = new UserModel();
    }

    isAuthenticated() {
        this.token = localStorage.getItem('token') ?? '';
        
        if (this.token === '') {
            router.push('/login');
            return false;
        }

        try {
            const decode = jwtDecode(this.token);
            const exp = decode.exp;
            const now = new Date().getTime() / 1000;

            if (now > exp) {
                router.push('/login');
                return false;
            }

            this.user.id = decode['Id'];
            this.user.name = decode['Name'];
            this.user.email = decode['Email'];
            this.user.userName = decode['UserName'];

            return true;
        } catch (error) {
            console.error('Token decode error:', error);
            router.push('/login');
            return false;
        }
    }

    getToken() {
        return this.token;
    }

    getUser() {
        return this.user;
    }

    logout() {
        localStorage.removeItem('token');
        this.token = '';
        this.user = new UserModel();
        router.push('/login');
    }
}

// Create a singleton instance
const authService = new AuthService();
export default authService;