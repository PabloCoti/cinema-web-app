import apiClient from "./apiClient"

export const listSchedules = async () => {
    return await apiClient.get("/schedules")
};

export const createSchedule = async (scheduleData) => {
    return await apiClient.post("/schedules", scheduleData);
};

export const getSchedule = async (scheduleId) => {
    return await apiClient.get(`/schedules/${scheduleId}`);
};

export const getMovieSchedules = async (movieId) => {
    return await apiClient.get(`/schedules/movie/${movieId}`);
}

export const updateSchedule = async (scheduleId, scheduleData) => {
    return await apiClient.put(`/schedules/${scheduleId}`, scheduleData);
};
