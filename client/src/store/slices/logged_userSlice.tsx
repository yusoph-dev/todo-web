import { createSlice } from '@reduxjs/toolkit';
import { LoggedUser } from '../../interfaces/models/logged_user';

export type LoggedUserState = LoggedUser | null;

const initialState: LoggedUserState = null;

export const logged_userSlice = createSlice({
  name: 'logged_user',
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state = action.payload;

      return state;
    },
    logout: (state) => {
      state = null;

      return state;
    },
  },
});

export const { login, logout } = logged_userSlice.actions;

export default logged_userSlice.reducer;
