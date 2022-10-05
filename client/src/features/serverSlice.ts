import { createSlice } from "@reduxjs/toolkit";

const serverSlice = createSlice({
  name: "server",
  initialState: {
    isApolloServer: false,
  },
  reducers: {},
  extraReducers: {},
});

export default serverSlice.reducer;
