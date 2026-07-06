import api from "./axios";

export const createPost = (formData) =>
  api.post("/posts", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const getPostsByCreator = (creatorId) => api.get(`/posts/creator/${creatorId}`);
export const deletePost = (id) => api.delete(`/posts/${id}`);
