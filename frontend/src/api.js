import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // assuming local backend
});

export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (email, password) => api.post('/auth/register', { email, password }),
};

export const highlightsAPI = {
    getAll: (userId) => api.get(`/highlights/${userId}`),
    create: (data) => api.post('/highlights', data),
    delete: (id) => api.delete(`/highlights/${id}`)
};

export const quizzesAPI = {
    getAll: (userId) => api.get(`/quizzes/${userId}`),
    saveScore: (data) => api.post('/quizzes', data),
    generateQuestions: (userId) => api.post('/quizzes/generate', { userId }),
};

export const feedbackAPI = {
    create: (data) => api.post('/feedback', data),
    getAll: () => api.get('/feedback')
};

export const progressAPI = {
    markComplete: (data) => api.post('/progress/mark-complete', data),
    get: (userId) => api.get(`/progress/${userId}`)
};

export const constitutionAPI = {
    getAll: () => api.get('/constitution'),
    create: (data, userId) => api.post('/constitution', data, { headers: { 'user-id': userId } }),
    update: (id, data, userId) => api.put(`/constitution/${id}`, data, { headers: { 'user-id': userId } }),
    delete: (id, userId) => api.delete(`/constitution/${id}`, { headers: { 'user-id': userId } }),
    bulkUpdate: (data, userId) => api.post('/constitution/bulk', { data }, { 
        headers: { 'user-id': userId } 
    }),
    searchAI: (messages) => api.post('/constitution/ai-search', { messages })
};

export default api;
