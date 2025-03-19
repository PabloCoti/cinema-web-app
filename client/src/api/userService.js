import apiClient from "./apiClient";

export const validateSession = async () => {
    return await apiClient.get('/auth/validate-session');
}

export const signUp = async (userData) => {
    return await apiClient.post("/auth/signup", userData);
};

export const signIn = async (credentials) => {
    return apiClient.post("/auth/signin", credentials);
};

export const logOut = async (credentials) => {
    return apiClient.post("/auth/logout", credentials);
};
