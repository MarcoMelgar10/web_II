import api from "./axios";

export const createGoal = (data) => api.post("/goals", data);
export const getGoalsByCreator = (creatorId) => api.get(`/goals/creator/${creatorId}`);
export const deleteGoal = (id) => api.delete(`/goals/${id}`);
