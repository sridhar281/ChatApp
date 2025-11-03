import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios'; // Adjust path if needed
import io from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === "development"? 'http://localhost:3002/':"/";
export const useAuthStore = create((set,get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers:[],
  socket:null,
  // ✅ Check if user is authenticated
 login: async (email, password) => { 
  set({ isLoggingIn: true });
  try {
    const response = await axiosInstance.post('/auth/login', { email, password });
    set({ authUser: response.data });

    // Delay connection until authUser is set
    setTimeout(() => get().connectSocket(), 0);

    toast.success('Login successful');
    return true;
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    toast.error(message);
    return false;
  } finally {
    set({ isLoggingIn: false });
  }
},

checkAuth: async () => {
  set({ isCheckingAuth: true });
  try {
    const response = await axiosInstance.get("/auth/check");
    set({ authUser: response.data });

    // Delay connection
    setTimeout(() => get().connectSocket(), 0);
  } catch (error) {
    set({ authUser: null });
  } finally {
    set({ isCheckingAuth: false });
  }
},

  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      const response = await axiosInstance.post('/auth/signup', payload);
      set({ authUser: response.data });
      toast.success('Signup successful! Please log in.');
      get().connectSocket();
      return true;
    } catch (error) {
      const message =
    error.response?.data?.message ||
    error.message ||
    'Signup failed. Please try again.';
    console.error('Signup error:', message);
    toast.error(message);
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });
      toast.success('Logged out successfully');
      get().disconnectSocket();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  },


  updateProfile: async (formData) => {
    set({ isUpdatingProfile: true });
    try {
      const response = await axiosInstance.put('/auth/update-profile', formData);
      set({ authUser: response.data });
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Profile update failed. Please try again.';
      console.error('Profile update error:', message);
      toast.error(message);
      return false;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  
  //todo: optimize this one
  setSelectedUser: (selectedUser) => set({ selectedUser}),

connectSocket: () => {
  const { authUser, socket } = get();
  if (!authUser?._id || socket?.connected) return;

  const newSocket = io("http://localhost:3002", {
    withCredentials: true,
    query: { userId: authUser._id },
  });

  newSocket.on("connect", () => {
    set({ socket: newSocket });
  });

  newSocket.on("getOnlineUsers", (userIds) => {
    set({ onlineUsers: userIds });
  });
},


disconnectSocket: () => {
  const { socket } = get();
  if (socket) {
    socket.disconnect();
    set({ socket: null });
  }
},
}));

export default useAuthStore;