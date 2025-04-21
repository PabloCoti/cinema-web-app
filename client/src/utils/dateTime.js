export const formatDate = (dateString) => {
    const date = new Date(dateString).toISOString().split("T")[0];
    return date;
}