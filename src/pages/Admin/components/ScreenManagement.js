import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Alert,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Theaters as TheatersIcon,
  LocalMovies as LocalMoviesIcon,
} from "@mui/icons-material";
import { screenAPI } from "../../../services/api";
import ShowManagement from './ShowManagement';

const SCREEN_TYPES = ["IMAX", "4DX", "2D", "3D", "Dolby Atmos"];
const FACILITIES = [
  "Recliner Seats",
  "Wheelchair Accessible",
  "VIP Lounge",
  "Food Service",
  "Online Booking",
];
const FORMATS = ["2D", "3D", "IMAX"];

const ScreenForm = ({ screen, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    screen_name: screen?.screen_name || "",
    screen_type: screen?.screen_type || "",
    seating_capacity: screen?.seating_capacity || "",
    facilities: screen?.facilities || [],
    show_timings: screen?.show_timings || [
      { start_time: "", end_time: "", format: "2D" },
    ],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleShowTimingChange = (index, field, value) => {
    const newShowTimings = [...formData.show_timings];
    newShowTimings[index] = {
      ...newShowTimings[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      show_timings: newShowTimings,
    });
  };

  const addShowTiming = () => {
    setFormData({
      ...formData,
      show_timings: [
        ...formData.show_timings,
        { start_time: "", end_time: "", format: "2D" },
      ],
    });
  };

  const removeShowTiming = (index) => {
    setFormData({
      ...formData,
      show_timings: formData.show_timings.filter((_, i) => i !== index),
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Screen Name"
            name="screen_name"
            value={formData.screen_name}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Screen Type</InputLabel>
            <Select
              name="screen_type"
              value={formData.screen_type}
              onChange={handleChange}
            >
              {SCREEN_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Seating Capacity"
            name="seating_capacity"
            type="number"
            value={formData.seating_capacity}
            onChange={handleChange}
            required
            inputProps={{ min: 50 }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Facilities</InputLabel>
            <Select
              multiple
              name="facilities"
              value={formData.facilities}
              onChange={handleChange}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {FACILITIES.map((facility) => (
                <MenuItem key={facility} value={facility}>
                  {facility}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Show Timings
          </Typography>
          {formData.show_timings.map((timing, index) => (
            <Box
              key={index}
              sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 1 }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Start Time"
                    type="time"
                    value={timing.start_time}
                    onChange={(e) =>
                      handleShowTimingChange(
                        index,
                        "start_time",
                        e.target.value
                      )
                    }
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="End Time"
                    type="time"
                    value={timing.end_time}
                    onChange={(e) =>
                      handleShowTimingChange(index, "end_time", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth required>
                    <InputLabel>Format</InputLabel>
                    <Select
                      value={timing.format}
                      onChange={(e) =>
                        handleShowTimingChange(index, "format", e.target.value)
                      }
                    >
                      {FORMATS.map((format) => (
                        <MenuItem key={format} value={format}>
                          {format}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton
                    onClick={() => removeShowTiming(index)}
                    disabled={formData.show_timings.length === 1}
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={addShowTiming}
            sx={{ mt: 1 }}
          >
            Add Show Timing
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          {screen ? "Update Screen" : "Add Screen"}
        </Button>
      </Box>
    </form>
  );
};

const ScreenManagement = ({ open, onClose, theatreId, theatreName }) => {
  const [screens, setScreens] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [showShowsManagement, setShowShowsManagement] = useState(false);
  const [selectedScreenForShows, setSelectedScreenForShows] = useState(null);

  useEffect(() => {
    if (open && theatreId) {
      fetchScreens();
    }
  }, [open, theatreId]);

  const fetchScreens = async () => {
    try {
      const response = await screenAPI.getScreensByTheatre(theatreId);
      setScreens(response.data || []);
    } catch (error) {
      setAlert({
        show: true,
        message: error.message || "Failed to fetch screens",
        type: "error",
      });
    }
  };

  const handleAddScreen = async (screenData) => {
    try {
      const screenPayload = {
        ...screenData,
        theatre_id: theatreId
      };
      
      await screenAPI.addScreen(screenPayload);
      setAlert({
        show: true,
        message: "Screen added successfully!",
        type: "success",
      });
      setShowForm(false);
      fetchScreens();
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.message || "Failed to add screen",
        type: "error",
      });
    }
  };

  const handleEditScreen = async (screenData) => {
    try {
      const screenPayload = {
        ...screenData,
        theatre_id: theatreId
      };
      
      await screenAPI.updateScreen(selectedScreen._id, screenPayload);
      setAlert({
        show: true,
        message: "Screen updated successfully!",
        type: "success",
      });
      setShowForm(false);
      setSelectedScreen(null);
      fetchScreens();
    } catch (error) {
      setAlert({
        show: true,
        message: error.response?.data?.message || "Failed to update screen",
        type: "error",
      });
    }
  };

  const handleDeleteScreen = async (screenId) => {
    if (window.confirm("Are you sure you want to delete this screen?")) {
      try {
        await screenAPI.deleteScreen(screenId);
        setAlert({
          show: true,
          message: "Screen deleted successfully!",
          type: "success",
        });
        fetchScreens();
      } catch (error) {
        setAlert({
          show: true,
          message: error.response?.data?.message || "Failed to delete screen",
          type: "error",
        });
      }
    }
  };

  const handleManageShows = (screen) => {
    setSelectedScreenForShows(screen);
    setShowShowsManagement(true);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Manage Screens - {theatreName}</DialogTitle>
      <DialogContent>
        {alert.show && (
          <Alert
            severity={alert.type}
            sx={{ mb: 3 }}
            onClose={() => setAlert({ ...alert, show: false })}
          >
            {alert.message}
          </Alert>
        )}

        {!showForm ? (
          <>
            <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                onClick={() => {
                  setSelectedScreen(null);
                  setShowForm(true);
                }}
              >
                Add New Screen
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Screen Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Capacity</TableCell>
                    <TableCell>Facilities</TableCell>
                    <TableCell>Show Timings</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {screens.map((screen) => (
                    <TableRow key={screen._id}>
                      <TableCell>{screen.screen_name}</TableCell>
                      <TableCell>{screen.screen_type}</TableCell>
                      <TableCell>{screen.seating_capacity}</TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {screen.facilities.map((facility, index) => (
                            <Chip
                              key={index}
                              label={facility}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {screen.show_timings.map((timing, index) => (
                          <Typography key={index} variant="body2">
                            {timing.start_time} - {timing.end_time} (
                            {timing.format})
                          </Typography>
                        ))}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            onClick={() => {
                              setSelectedScreen(screen);
                              setShowForm(true);
                            }}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteScreen(screen._id)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleManageShows(screen)}
                          >
                            Manage Shows
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ) : (
          <ScreenForm
            screen={selectedScreen}
            onSubmit={selectedScreen ? handleEditScreen : handleAddScreen}
            onClose={() => {
              setShowForm(false);
              setSelectedScreen(null);
            }}
          />
        )}
      </DialogContent>

      <Dialog
        open={showShowsManagement}
        onClose={() => setShowShowsManagement(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Manage Shows - Screen {selectedScreenForShows?.screen_name}
        </DialogTitle>
        <DialogContent>
          {selectedScreenForShows && (
            <ShowManagement
              theatreId={theatreId}
              screenId={selectedScreenForShows._id}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShowsManagement(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default ScreenManagement;
