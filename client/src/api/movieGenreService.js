import apiClient from "./apiClient";

export const listMovieGenres = async (filters = null) => {
    if (filters) {
        return await apiClient.get("/movie-genres", { params: filters });
    }

    return await apiClient.get("/movie-genres");
}