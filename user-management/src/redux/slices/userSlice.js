import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUsers, getAllUsers, createUser, updateUser, deleteUser } from '../../services/api';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (page, { rejectWithValue }) => {
    try {
      const response = await getUsers(page);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch users');
    }
  }
);

export const searchAllUsers = createAsyncThunk(
  'users/searchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const allUsers = await getAllUsers();
      return allUsers;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to search users');
    }
  }
);

export const addUser = createAsyncThunk(
  'users/addUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await createUser(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create user');
    }
  }
);

export const editUser = createAsyncThunk(
  'users/editUser',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await updateUser(id, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update user');
    }
  }
);

export const removeUser = createAsyncThunk(
  'users/removeUser',
  async (id, { rejectWithValue }) => {
    try {
      await deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete user');
    }
  }
);

const initialState = {
  users: [],
  allUsers: [],
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
  searchQuery: '',
  viewMode: 'table',
  isSearching: false,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      if (!action.payload) {
        state.isSearching = false;
        state.allUsers = [];
      }
    },
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === 'table' ? 'card' : 'table';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.totalPages = action.payload.total_pages;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search All Users
      .addCase(searchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
        state.isSearching = true;
      })
      .addCase(searchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add User
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      // Edit User
      .addCase(editUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      // Remove User
      .addCase(removeUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      });
  },
});

export const { setSearchQuery, toggleViewMode, clearError } = userSlice.actions;

// Selectors
export const selectFilteredUsers = (state) => {
  const { users, allUsers, searchQuery, isSearching } = state.users;

  if (!searchQuery) return users;

  const usersToFilter = isSearching ? allUsers : users;
  
  const query = searchQuery.toLowerCase();
  return usersToFilter.filter((user) => 
    user.first_name?.toLowerCase().includes(query) ||
    user.last_name?.toLowerCase().includes(query) ||
    user.email?.toLowerCase().includes(query)
  );
};

export default userSlice.reducer;
