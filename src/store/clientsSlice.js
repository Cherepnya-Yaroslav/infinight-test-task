import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  clients: [],
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setClients: (state, action) => {
      state.clients = action.payload;
    },
    addClient: (state, action) => {
      state.clients.push(action.payload);
    },
    removeClient: (state, action) => {
      state.clients = state.clients.filter(client => client.id !== action.payload);
    },
    updateClient: (state, action) => {
      const index = state.clients.findIndex(client => client.id === action.payload.id);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
    },
  },
});

export const { setClients, addClient, removeClient, updateClient } = clientsSlice.actions;
export default clientsSlice.reducer; 