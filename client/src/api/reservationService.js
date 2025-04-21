import apiClient from "./apiClient";

export const createReservation = async ({ scheduleId, seatIds, payment }) => {
  return await apiClient.post("/reservations", {
    scheduleId,
    seatIds,
    payment,
  });
};

export const getReservationsBySchedule = async (scheduleId) => {
  return await apiClient.get(`/reservations?scheduleId=${scheduleId}`);
};

export const getMyReservations = async () => {
  return await apiClient.get("/reservations/my");
};

export const getReservationById = async (id) => {
  return await apiClient.get(`/reservations/${id}`);
};
