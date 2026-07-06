import api from "./axios";

export const sendDonation = (data) => api.post("/donations", data);
export const getDonationHistory = (params) => api.get("/donations/history", { params });
export const getCreatorIncome = (params) => api.get("/donations/income", { params });
