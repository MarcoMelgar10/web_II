import api from "./axios";

export const getFeed = () => api.get("/feed");
