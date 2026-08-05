import axios from "axios";
import { store } from "../../../store";
import { API_BASE_URL } from "../../../config/env";

const BASE_URL = API_BASE_URL;

export const favoritebakeryApi = {
  getFavoriteBakery: async () => {
    if (store.getState().auth.isAuthenticated) {
      const response = await axios.get(`${BASE_URL}/favorite`);
      return response.data;
    }
    return null;
  },
};