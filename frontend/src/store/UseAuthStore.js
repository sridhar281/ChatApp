import {create} from 'zustand';
import {axiosInstance} from '../lib/axios'; // Adjust the import path as necessary


export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    checkAuth: async () => {
        set({isCheckingAuth: true});
        try {
            const response = await axiosInstance.get('/auth/check');
            set({authUser: response.data});
        } catch (error) {
            set({authUser: null});
            console.error('Error checking authentication:', error);
        }
        finally {
            set({isCheckingAuth: false});
        }
    },
}));