import apiClient from "./apiClient";

export const listMovies = async () => {
    return await apiClient.get("/movies");
};

export const createMovie = async (movieData) => {
    return await apiClient.post("/movies", movieData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getMovie = async (movieId) => {
    return await apiClient.get(`/movies/${movieId}`);
};

export const updateMovieData = async (movieId, movieData) => {
    return await apiClient.put(`/movies/${movieId}`, movieData);
};

export const updateMovieImage = async (movieId, imageData) => {
    return await apiClient.put(`/movies/${movieId}/image`, imageData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const deleteMovie = async (movieId) => {
    return await apiClient.delete(`/movies/${movieId}`);
};
