import axios from 'axios';

// Base URL for our backend API
const API_BASE_URL = 'http://localhost:5000/api/services'; // Updated to use the new proxy base URL

// API service for 3D avatar generation, voice cloning, and AI interaction via backend proxy
const AvatarAPIService = {
  // Generate 3D avatar from image
  generateAvatar: async (imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      // Call backend proxy endpoint
      const response = await axios.post(`${API_BASE_URL}/avatar/generate`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Authorization header will be added by AuthContext if user is logged in
        }
      });
      return response.data; // Return data from backend proxy
    } catch (error) {
      console.error('Error generating avatar via proxy:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },
  
  // Clone voice from audio samples
  cloneVoice: async (audioBlob: Blob, filename: string = 'voice_sample.wav') => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, filename);
      
      // Call backend proxy endpoint
      const response = await axios.post(`${API_BASE_URL}/voice/clone`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error cloning voice via proxy:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },
  
  // Generate speech from text using cloned voice
  generateSpeech: async (text: string, voiceId: string) => {
    try {
      // Call backend proxy endpoint
      const response = await axios.post(`${API_BASE_URL}/voice/speak`, {
        text,
        voiceId
      });
      return response.data; 
    } catch (error) {
      console.error('Error generating speech via proxy:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },
  
  // Get AI response for conversation
  getAIResponse: async (message: string, legacyId: string, conversationHistory: Array<{sender: string, content: string}>) => {
    try {
      // Call backend proxy endpoint
      const response = await axios.post(`${API_BASE_URL}/ai/chat`, {
        message,
        legacyId,
        conversationHistory
      });
      return response.data;
    } catch (error) {
      console.error('Error getting AI response via proxy:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  }
};

export default AvatarAPIService;
