import apiClient from "./apiClient";

export const listRooms = async (filters = null) => {
    if (filters) {
        return await apiClient.get("/rooms", { params: filters });
    }

    return await apiClient.get("/rooms");
};

export const createRoom = async (roomData, seatsData) => {
    return await apiClient.post('/rooms', {
        roomData,
        seatsData,
    });
};

export const getRoom = async (roomId) => {
    return await apiClient.get(`/rooms/${roomId}`);
};

export const updateRoom = async (roomId, roomData, seatsData = null) => {
    return await apiClient.put(`/rooms/${roomId}`, {
        roomData,
        seatsData,
    });
};

export const deleteRoom = async (roomId) => {
    return await apiClient.delete(`/rooms/${roomId}`);
}
