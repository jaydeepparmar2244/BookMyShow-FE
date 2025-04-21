import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { styled } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline, Box, CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import CityProtectedRoute from "./components/CityProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LocationSelector from "./pages/LocationSelector";
import ShowsList from "./pages/ShowsList";
import MovieDetails from "./pages/MovieDetails";
import BookingPage from "./pages/BookingPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import MovieManagement from "./pages/Admin/MovieManagement";
import TheatreManagement from "./pages/Admin/TheatreManagement";
import ShowManagement from "./pages/Admin/ShowManagement";
import DashboardOverview from "./pages/Admin/DashboardOverview";
import SelectLocation from "./pages/SelectLocation";
import FAQs from "./pages/FAQs";
import Terms from "./pages/Terms";
import Profile from "./pages/Profile";
import Bookings from "./pages/Bookings";

// Theme configuration
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#ffffff",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

// Styled components
const PageContainer = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#f5f5f5",
  margin: 0,
  padding: 0,
});

const MainContent = styled(Box)({
  flex: 1,
  padding: 0,
  margin: 0,
  width: "100%",
  overflowX: "hidden",
});

// Animation variants
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

const AppContent = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <PageContainer>
      <Navbar />
      <MainContent>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes - Accessible when logged out */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <motion.div {...pageTransition}>
                    <Login />
                  </motion.div>
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <motion.div {...pageTransition}>
                    <Signup />
                  </motion.div>
                </PublicRoute>
              }
            />

            {/* Home and Movies Routes - Show same content */}
            <Route
              path="/"
              element={
                <CityProtectedRoute>
                  <motion.div {...pageTransition}>
                    <ShowsList />
                  </motion.div>
                </CityProtectedRoute>
              }
            />
            <Route
              path="/movies"
              element={
                <Navigate to="/" replace />
              }
            />

            {/* City Selection Route - Always accessible */}
            <Route
              path="/select-location"
              element={
                <ProtectedRoute>
                  <motion.div {...pageTransition}>
                    <SelectLocation />
                  </motion.div>
                </ProtectedRoute>
              }
            />

            {/* Movie Details Route - Requires city selection */}
            <Route
              path="/movie/:movieId"
              element={
                <CityProtectedRoute>
                  <motion.div {...pageTransition}>
                    <MovieDetails />
                  </motion.div>
                </CityProtectedRoute>
              }
            />

            {/* Protected Routes - Only accessible when logged in */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <motion.div {...pageTransition}>
                    <Profile />
                  </motion.div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <motion.div {...pageTransition}>
                    <Bookings />
                  </motion.div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking/:id"
              element={
                <ProtectedRoute>
                  <CityProtectedRoute>
                    <motion.div {...pageTransition}>
                      <BookingPage />
                    </motion.div>
                  </CityProtectedRoute>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <motion.div {...pageTransition}>
                    <AdminDashboard />
                  </motion.div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/theatres"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <motion.div {...pageTransition}>
                    <TheatreManagement />
                  </motion.div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/shows"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <motion.div {...pageTransition}>
                    <ShowManagement />
                  </motion.div>
                </ProtectedRoute>
              }
            />

            {/* Info Pages - Always accessible */}
            <Route
              path="/faqs"
              element={
                <motion.div {...pageTransition}>
                  <FAQs />
                </motion.div>
              }
            />
            <Route
              path="/terms"
              element={
                <motion.div {...pageTransition}>
                  <Terms />
                </motion.div>
              }
            />

            {/* Catch all route - redirect to home */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </AnimatePresence>
      </MainContent>
      <Footer />
    </PageContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
