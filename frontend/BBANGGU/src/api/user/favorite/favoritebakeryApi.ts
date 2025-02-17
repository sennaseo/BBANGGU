import axios from "axios";
import { store } from "../../../store";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const favoritebakeryApi = {
  getFavoriteBakery: async () => {
    const token = store.getState().user.token;
    if (token) {    
      const response = await axios.get(`${BASE_URL}/favorite`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    }
    return null;
  },
};