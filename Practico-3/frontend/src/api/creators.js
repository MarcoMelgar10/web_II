import api from "./axios";

export const getMyProfile = () => api.get("/creator-profile/me");
export const createProfile = (data) => api.post("/creator-profile", data);
export const updateProfile = (data) => api.put("/creator-profile", data);
export const uploadAvatar = (formData) =>
  api.post("/creator-profile/avatar", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const uploadBanner = (formData) =>
  api.post("/creator-profile/banner", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const getAllCreators = () => api.get("/creators");
export const searchCreators = (q) => api.get(`/creators/search?q=${q}`);
export const getCreatorPublicProfile = (id) => api.get(`/creators/${id}`);
