import axios from "axios";
import { store } from "../../../store";
import { API_BASE_URL } from "../../../config/env";

const BASE_URL = API_BASE_URL;

export const favoritebakeryApi = {
  getFavoriteBakery: async () => {
    const token = store.getState().auth.accessToken;
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