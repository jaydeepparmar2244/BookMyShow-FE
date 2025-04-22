import axios from "axios";

if (!process.env.REACT_APP_API_BASE_URL) {
  console.error("API Base URL not found in environment variables");
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to handle logout
const handleLogout = () => {
  localStorage.clear();
  // Use window.location.replace to ensure we clear the history stack
  window.location.replace("/login");
};

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    // Check token validity before making the request
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        if (tokenData.exp * 1000 < Date.now()) {
          // Token is expired
          handleLogout();
          return Promise.reject(
            new Error("Session expired. Please login again.")
          );
        }
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        // Invalid token format
        handleLogout();
        return Promise.reject(
          new Error("Invalid session. Please login again.")
        );
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle all authentication/authorization related errors
      if (
        error.response.status === 401 ||
        error.response.status === 403 ||
        error.response?.data?.message
          ?.toLowerCase()
          .includes("invalid token") ||
        error.response?.data?.message
          ?.toLowerCase()
          .includes("expired token") ||
        error.response?.data?.message?.toLowerCase().includes("unauthorized")
      ) {
        handleLogout();
        return Promise.reject(
          new Error("Session expired. Please login again.")
        );
      }

      // Handle other error responses
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

// Auth APIs with better error handling
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post("/users/login", credentials);
      return {
        data: {
          token: response.data.token,
          message: response.data.message,
        },
      };
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post("/users/register", userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Movie APIs
export const moviesAPI = {
  getAllMovies: () => api.get("/movies"),
  getMovieById: (id) => api.get(`/movies/${id}`),
  addMovie: (movieData) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    return api.post("/movies/new", movieData, config);
  },
  updateMovie: (id, movieData) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    return api.put(`/movies/${id}`, movieData, config);
  },
  deleteMovie: (id) => api.delete(`/movies/${id}`),
};

// Theatre APIs with correct endpoint
export const theatreAPI = {
  getAllTheatres: () => api.get("/theatres"),
  getTheatreById: (id) => api.get(`/theatres/${id}`),
  addTheatre: (theatreData) => api.post("/theatres/new", theatreData),
  updateTheatre: (id, theatreData) => api.put(`/theatres/${id}`, theatreData),
  deleteTheatre: (id) => api.delete(`/theatres/${id}`),
};
// Theatre APIs with correct endpoint
export const showsAPI = {
  getAllShows: () => api.get("/shows"),
  getMoviesShows: (city) => api.get(`/shows/movies/${city}`),
  getShowsByMovie: (movieId, city) =>
    api.get(`/shows/movie/${movieId}/city/${city}`),
  addShow: (showData) => api.post("/shows/new", showData),
  updateShow: (showId, showData) => api.put(`/shows/${showId}`, showData),
  deleteShow: (showId) => api.delete(`/shows/${showId}`),
};

// Screen APIs
export const screenAPI = {
  getAllScreens: () => api.get("/screens"),
  getScreensByTheatre: (theatreId) =>
    api.get(`/screens/theatre/${theatreId}/screens`),
  addScreen: (screenData) => api.post("/screens/new", screenData),
  updateScreen: (screenId, screenData) =>
    api.put(`/screens/${screenId}`, screenData),
  deleteScreen: (screenId) => api.delete(`/screens/${screenId}`),
};

// Booking APIs
export const bookingsAPI = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getUserBookings: async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      return response.data; // The data is already an array from backend
    } catch (error) {
      return []; // Return empty array on error
    }
  },

  getBookingById: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  cancelBooking: async (bookingId) => {
    const response = await api.put(`/bookings/${bookingId}/cancel`);
    return response.data;
  }
};

// User APIs
export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (userData) => api.put("/users/profile", userData),
  changePassword: (passwords) => api.post("/users/change-password", passwords),
};

// City APIs
export const cityAPI = {
  getAllCities: () => api.get("/cities"),
  getCityById: (id) => api.get(`/cities/${id}`),
};

// Enhanced token validation function
export const validateToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    handleLogout();
    return false;
  }

  try {
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    if (tokenData.exp * 1000 < Date.now()) {
      handleLogout();
      return false;
    }
    // Also check if token format is valid
    if (!tokenData.id || !tokenData.role) {
      handleLogout();
      return false;
    }
    return true;
  } catch (error) {
    handleLogout();
    return false;
  }
};

export default api;
