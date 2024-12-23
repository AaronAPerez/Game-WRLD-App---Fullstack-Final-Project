import axios from "axios";

// Notification service calls
export const notificationService = {
    getNotifications: () => axios.get('/notifications'),
    markAsRead: (id: string) => axios.post(`/notifications/${id}/read`),
  };