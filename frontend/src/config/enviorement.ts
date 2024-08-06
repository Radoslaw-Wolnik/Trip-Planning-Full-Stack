// sth like that:

export default {
  API_URL: import.meta.env.VITE_API_URL as string || 'http://localhost:5000/api',
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string || 'YourGoogleMapsAPIKEY'
}

