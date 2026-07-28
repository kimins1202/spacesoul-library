import { api } from "./api";

const publisherService = {
  getPublishers: async () => {
    return await api.get("/publishers");
  },
};

export default publisherService;
