import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/mockApi';

// Асинхронные actions
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await api.getAllUsers();
    if (!response.success) {
      throw new Error('Failed to fetch users');
    }
    return response.data;
  }
);

export const updateUserAsync = createAsyncThunk(
  'users/updateUser',
  async (userData) => {
    // Здесь должен быть ваш API запрос для обновления
    return userData;
  }
);

export const resetUsersAsync = createAsyncThunk(
  'users/resetUsers',
  async () => {
    // Здесь должен быть ваш API запрос для сброса
    return [];
  }
);

const initialState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    selectUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Обработка updateUserAsync
      .addCase(updateUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
          if (state.selectedUser?.id === action.payload.id) {
            state.selectedUser = action.payload;
          }
        }
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Обработка resetUsersAsync
      .addCase(resetUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.selectedUser = null;
      })
      .addCase(resetUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { selectUser, setUsers, updateUser } = usersSlice.actions;
export default usersSlice.reducer; 