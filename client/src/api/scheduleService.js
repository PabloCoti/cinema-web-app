import apiClient from "./apiClient"

export const listSchedules = async () => {
    return await apiClient.get("/schedules")
};

export const createSchedule = async (scheduleData) => {
    return await apiClient.post("/schedules", scheduleData);
}