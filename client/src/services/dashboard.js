import { api } from "./api";

const dashboardService = {
  getStats: async (days = 7) => {
    return await api.get(`/dashboard?days=${days}`);
  },
};

export default dashboardService;
