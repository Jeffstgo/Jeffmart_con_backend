import { http } from "./http";

export const profileApi = {
  getProfile: async () => {
    const response = await http.get("/auth/profile");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await http.put("/auth/profile", profileData);
    return response.data;
  }
};
