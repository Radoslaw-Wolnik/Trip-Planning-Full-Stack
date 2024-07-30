//import { API_URL } from '../config';

const API_URL = 'http://localhost:5000';

export const getFullImageUrl = (imagePath: string | undefined) => {
  return imagePath ? `${API_URL}${imagePath}` : '/default-avatar.png';
};