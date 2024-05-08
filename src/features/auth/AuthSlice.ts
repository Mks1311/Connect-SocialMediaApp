import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '@/types';

export interface AuthState {
  user: IUser;
  isLoading: boolean;
  isAuthenticated: boolean;
}
const userId=localStorage.getItem("id")
const username=localStorage.getItem("name")
const userusername=localStorage.getItem("username")
const useremail=localStorage.getItem("email")
const userimageUrl=localStorage.getItem("imageUrl")
const userbio=localStorage.getItem("bio")
const initialState: AuthState = {
  user: {
    id: userId!==null?userId:"",
    name: username!==null?username:"",
    username: userusername!==null?userusername:"",
    email: useremail!==null?useremail:"",
    imageUrl: userimageUrl!==null?userimageUrl:"",
    bio: userbio!==null?userbio:"",
  },
  isLoading: false,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
      // localStorage.setItem("userInfo",JSON.stringify(state.user))
      localStorage.setItem("id",(state.user.id))
      localStorage.setItem("name",(state.user.name))
      localStorage.setItem("username",(state.user.username))
      localStorage.setItem("email",(state.user.email))
      localStorage.setItem("imageUrl",(state.user.imageUrl))
      localStorage.setItem("bio",(state.user.bio))
    },
    setIsAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, setIsAuthenticated, setLoading } = authSlice.actions;
export default authSlice.reducer;
