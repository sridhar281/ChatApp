import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios'; // Adjust path if needed
export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers:[],
  // ✅ Check if user is authenticated
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
    } catch (error) {
      set({ authUser: null });
      console.error('Error checking authentication:', error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (email, password) => { 
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      set({ authUser: response.data });
      toast.success('Login successful');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      console.error('Login error:', message);
      toast.error(message);
      return false;
    } finally {
      set({ isLoggingIn: false });
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
}));

export default useAuthStore;