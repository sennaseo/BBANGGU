import { createSlice } from "@reduxjs/toolkit";

export type TextRadioValueType = {
    title: string,
    contents: string,
    price: number,
    count: number, 
    exchange_product: string,
    tags: string[],
    shipping_cost: string,
    deal_type: string,
    quality: string,
    changable: string,
    address: string,
    detailAddress: string
  }
  
  export const productsPostsTextInit: TextRadioValueType = {
    title: "",
    contents: "",
    price: 0,
    count: 0, 
    exchange_product: "",
    tags: [],
    shipping_cost: "",
    deal_type: "",
    quality: "",
    changable: "",
    address: "",
    detailAddress: ""
  }

  const addressSlice = createSlice({
    name: 'address',
    initialState: productsPostsTextInit,
    reducers: {
        setAddress: (state, action) => {
            state.address = action.payload;
        },
        setDetailAddress: (state, action) => {
            state.detailAddress = action.payload;
        }
    }
  })

  export default addressSlice.reducer;
  
  
