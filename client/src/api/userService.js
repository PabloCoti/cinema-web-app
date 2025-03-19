import apiClient from "./apiClient";

export const session = async (credentials) => {
    return apiClient.get("/auth/session", credentials);
};

export const signUp = async (userData) => {
    return apiClient.post("/signup", userData);
};

export const signIn = async (credentials) => {
    return apiClient.post("/signin", credentials);
};
