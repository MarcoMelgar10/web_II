import api from "./axios";

export const addComment = (data) => api.post("/comments", data);
export const getCommentsByPost = (postId) => api.get(`/comments/post/${postId}`);
