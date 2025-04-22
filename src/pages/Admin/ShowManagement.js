import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Card,
  CardContent,
  CircularProgress,
  Rating,
  OutlinedInput,
  ListItemText,
  Checkbox,
  FormHelperText,
  CardMedia,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  Movie as MovieIcon,
  CloudUpload as CloudUploadIcon,
  Language as LanguageIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { moviesAPI, showsAPI, theatreAPI, screenAPI } from "../../services/api";
import { FALLBACK_IMAGES } from "../../constants/images";
import { DEFAULT_IMAGES } from "../../constants/defaultImages";
import axios from "axios";

const GENRES = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Animation",
  "Documentary",
];

const LANGUAGES = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Japanese",
  "Chinese",
  "Korean",
  "Other",
];

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#000",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#333",
  },
}));

const MovieCard = styled(Paper)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  borderRadius: theme.spacing(1),
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: theme.shadows[4],
  },
}));

// Styled component for hidden file input
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ShowFormDialog = ({
  open,
  handleClose,
  selectedShow,
  handleSubmit,
  allTheatresList,
  allMoviesList,
}) => {
  const [formData, setFormData] = useState({
    movie: "",
    theatre: "",
    screen: "",
    price_per_seat: "",
    show_time: "",
    available_seats: "",
  });

  const [errors, setErrors] = useState({});
  const [theatreScreensList, setTheatreScreensList] = useState([]);
  const [screenShowTimes, setScreenShowTimes] = useState([]);

  useEffect(() => {
    if (selectedShow) {
      setFormData({
        movie: selectedShow.movie?._id || "",
        theatre: selectedShow.theatre?._id || "",
        screen: selectedShow.screen?._id || "",
        price_per_seat: selectedShow.price_per_seat || "",
        show_time: selectedShow.show_time || "",
        available_seats: selectedShow.available_seats || "",
      });
    } else {
      setFormData({
        movie: "",
        theatre: "",
        screen: "",
        price_per_seat: "",
        show_time: "",
        available_seats: "",
      });
    }
  }, [selectedShow]);

  useEffect(() => {
    if (formData.theatre) {
      fetchScreensOfTheatre();
    }
  }, [formData.theatre]);

  const fetchScreensOfTheatre = async () => {
    try {
      const response = await screenAPI.getScreensByTheatre(formData.theatre);
      setTheatreScreensList(response.data || []);
    } catch (error) {
      console.error("Error fetching screens:", error);
    }
  };

  useEffect(() => {
    if (formData?.screen) {
      const selectedScreen = theatreScreensList?.find(
        (item) => item?._id == formData?.screen
      );
      setScreenShowTimes(selectedScreen?.show_timings || []);
      setFormData({
        ...formData,
        available_seats: selectedScreen?.seating_capacity,
      });
    }
  }, [formData?.screen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.movie) newErrors.movie = "Movie is required";
    if (!formData.theatre) newErrors.theatre = "Theatre is required";
    if (!formData.screen) newErrors.screen = "Screen is required";
    if (!formData.price_per_seat)
      newErrors.price_per_seat = "Price per seat is required";
    if (!formData.show_time) newErrors.show_time = "Show time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    handleSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{selectedShow ? "Edit Show" : "Add New Show"}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.movie} required>
                <InputLabel>Movie</InputLabel>
                <Select
                  value={formData.movie}
                  onChange={(e) =>
                    setFormData({ ...formData, movie: e.target.value })
                  }
                  label="Movie"
                >
                  {allMoviesList.map((movie) => (
                    <MenuItem key={movie._id} value={movie._id}>
                      {movie.movie_name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.movie && (
                  <FormHelperText error>{errors.movie}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.theatre} required>
                <InputLabel>Theatre</InputLabel>
                <Select
                  value={formData.theatre}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      theatre: e.target.value,
                      screen: "",
                    })
                  }
                  label="Theatre"
                >
                  {allTheatresList.map((theatre) => (
                    <MenuItem key={theatre._id} value={theatre._id}>
                      {theatre.theatre_name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.theatre && (
                  <FormHelperText error>{errors.theatre}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.screen} required>
                <InputLabel>Screen</InputLabel>
                <Select
                  value={formData.screen}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      screen: e.target.value,
                      show_time: "",
                    })
                  }
                  label="Screen"
                  disabled={!formData.theatre}
                >
                  {theatreScreensList.map((screen) => (
                    <MenuItem key={screen._id} value={screen._id}>
                      {screen?.screen_name + " " + screen?.screen_type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.screen && (
                  <FormHelperText error>{errors.screen}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price per Seat"
                type="number"
                value={formData.price_per_seat}
                onChange={(e) =>
                  setFormData({ ...formData, price_per_seat: e.target.value })
                }
                error={!!errors.price_per_seat}
                helperText={errors.price_per_seat}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.show_time} required>
                <InputLabel>Show Time</InputLabel>
                <Select
                  value={formData.show_time}
                  onChange={(e) =>
                    setFormData({ ...formData, show_time: e.target.value })
                  }
                  label="Show Time"
                  disabled={!formData.screen}
                >
                  {screenShowTimes.map((time) => (
                    <MenuItem key={time?._id} value={time}>
                      {time?.start_time + " - " + time?.end_time}
                    </MenuItem>
                  ))}
                </Select>
                {errors.show_time && (
                  <FormHelperText error>{errors.show_time}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <StyledButton onClick={handleSave}>
          {selectedShow ? "Update" : "Create"}
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
};

const ShowManagement = () => {
  const [shows, setShows] = useState([]);
  const [allTheatresList, setAllTheatresList] = useState([]);
  const [allMoviesList, setAllMoviesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedShow, setSelectedShow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [theatresResponse, moviesResponse, showsResponse] =
        await Promise.all([
          theatreAPI.getAllTheatres(),
          moviesAPI.getAllMovies(),
          showsAPI.getAllShows(),
        ]);

      setAllTheatresList(theatresResponse.data || []);
      setAllMoviesList(moviesResponse.data || []);
      setShows(showsResponse.data || []);
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (show = null) => {
    setSelectedShow(show);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedShow(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedShow) {
        await showsAPI.updateShow(selectedShow._id, formData);
      } else {
        await showsAPI.addShow(formData);
      }
      fetchAllData();
      handleCloseDialog();
    } catch (error) {
      setError("Failed to save show. Please try again.");
    }
  };

  const handleDelete = async (showId) => {
    if (window.confirm("Are you sure you want to delete this show?")) {
      try {
        await showsAPI.deleteShow(showId);
        fetchAllData();
      } catch (error) {
        setError("Failed to delete show. Please try again.");
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Show Management
        </Typography>
        <StyledButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Show
        </StyledButton>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Movie</TableCell>
                <TableCell>Theatre</TableCell>
                <TableCell>Screen</TableCell>
                <TableCell>Show Time</TableCell>
                <TableCell>Price per Seat</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((show) => (
                  <TableRow key={show._id}>
                    <TableCell>{show?.movie?.movie_name}</TableCell>
                    <TableCell>{show?.theatre?.theatre_name}</TableCell>
                    <TableCell>{show?.screen?.screen_name}</TableCell>
                    <TableCell>
                      {show?.show_time?.start_time +
                        " - " +
                        show?.show_time?.end_time}
                    </TableCell>
                    <TableCell>₹{show?.price_per_seat}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleOpenDialog(show)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(show._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={shows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}

      <ShowFormDialog
        open={dialogOpen}
        handleClose={handleCloseDialog}
        selectedShow={selectedShow}
        handleSubmit={handleSubmit}
        allTheatresList={allTheatresList}
        allMoviesList={allMoviesList}
      />
    </Container>
  );
};

export default ShowManagement;
