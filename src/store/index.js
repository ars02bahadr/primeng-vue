import { jwtDecode } from 'jwt-decode';
import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import UserModel from '../model/UserModel';
import router from '../router';
import authService from '../shared/AuthService';
import httpService from '../shared/HttpService';

const store = createStore({
    state: {
        user: null,
        token: null,
        isAuthenticated: false
    },

    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setToken(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
        },
        setAuthenticated(state, value) {
            state.isAuthenticated = value;
        },
        clearUserData(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        }
    },

    actions: {
        async login({ commit }, credentials) {
            try {
                const response = await httpService.post('Auth/Login', credentials);
                const token = response.data.data.token;
                localStorage.setItem('token', token);

                if (token) {
                    commit('setToken', token);

                    const decoded = jwtDecode(token);
                    const user = new UserModel();
                    user.id = decoded['Id'];
                    user.name = decoded['Name'];
                    user.email = decoded['Email'];
                    user.userName = decoded['UserName'];

                    commit('setUser', user);
                    commit('setAuthenticated', true);

                    router.push('/');
                    return true;
                }
                return false;
            } catch (error) {
                commit('clearUserData');
                throw error;
            }
        },

        async logout({ commit }) {
            commit('clearUserData');
            router.push('/login');
        },

        checkAuth({ commit, state }) {
            if (!authService.isAuthenticated()) {
                commit('clearUserData');
                return false;
            }

            if (!state.user) {
                commit('setUser', authService.user);
            }

            commit('setToken', authService.token);
            commit('setAuthenticated', true);
            return true;
        }
    },

    getters: {
        isAuthenticated: (state) => state.isAuthenticated,
        currentUser: (state) => state.user,
        token: (state) => state.token
    },

    plugins: [
        createPersistedState({
            paths: ['user', 'token', 'isAuthenticated']
        })
    ]
});

export default store;
