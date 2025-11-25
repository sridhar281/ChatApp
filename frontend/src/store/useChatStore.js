import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import {useAuthStore} from './useAuthStore';

const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const response = await axiosInstance.get('/messages/users');
      set({ users: response.data });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users. Please try again.');
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    if (!userId || userId === 'undefined') {
      console.warn('Invalid userId provided for getMessages:', userId);
      set({ messages: [], isMessagesLoading: false });
      return;
    }
    set({ isMessagesLoading: true });
    try {
      const response = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: response.data });
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages. Please try again.');
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async ({ text, image, receiverId }) => {
    const { selectedUser, messages } = get();
    if (!receiverId && !selectedUser?._id) {
      toast.error('No user selected. Please select a user to send a message.');
      return;
    }
    const targetReceiverId = receiverId || selectedUser._id;
    try {
      const res = await axiosInstance.post(`/messages/send/${targetReceiverId}`, {
        text,
        image,
      });
      set({ messages: [...messages, res.data] });
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    }
  },

  subscribeToMessages:()=>{
    const {selectedUser} =get();
    if(!selectedUser) return;

    const socket = useAuthStore.getState().socket;
   //todo optimize

    socket.on("newMessage",(newMessage)=>{
      if(newMessage.senderId !== selectedUser._id && newMessage.receiverId !== selectedUser._id){
        return;
      }
      set({
        messages:[...get().messages,newMessage],
      });
    });
  },
  
  unsubscribeFromMessages:()=>{
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  //todo optimizer 

  setSelectedUser: (selectedUser) => set({ selectedUser }),
  setMessages: (messages) => set({ messages }),
}));

export default useChatStore;