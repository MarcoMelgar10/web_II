import api from "./axios";

export const toggleFavorite = (creatorId) => api.post(`/favorites/${creatorId}`);
export const getFavorites = () => api.get("/favorites");
