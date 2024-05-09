import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '@/types';

export interface AuthState {
  user: IUser;
}
const userId=localStorage.getItem("id")
const username=localStorage.getItem("name")
const userusername=localStorage.getItem("username")
const useremail=localStorage.getItem("email")
const userimageUrl=localStorage.getItem("imageUrl")
const userbio=localStorage.getItem("bio")
const userimageId=localStorage.getItem("imageId")

const initialState: AuthState = {
  user: {
    id: userId!==null?userId:"",
    name: username!==null?username:"",
    username: userusername!==null?userusername:"",
    email: useremail!==null?useremail:"",
    imageUrl: userimageUrl!==null?userimageUrl:"",
    bio: userbio!==null?userbio:"",
    imageId:userimageId!==null?userimageId:"",
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
      localStorage.setItem("id",(state.user.id))
      localStorage.setItem("name",(state.user.name))
      localStorage.setItem("username",(state.user.username))
      localStorage.setItem("email",(state.user.email))
      localStorage.setItem("imageUrl",(state.user.imageUrl))
      localStorage.setItem("bio",(state.user.bio))
      localStorage.setItem("imageId",(state.user.imageId))
    },
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
