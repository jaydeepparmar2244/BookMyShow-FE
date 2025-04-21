import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Chip,
  Box,
  InputLabel,
  Select,
  IconButton,
  FormHelperText,
  Typography,
  Stack,
  FormControl,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

const FACILITIES = [
  "Recliner Seats",
  "Wheelchair Accessible",
  "VIP Lounge",
  "Food Service",
  "Online Booking",
];

const SCREEN_TYPES = ["IMAX", "4DX", "2D", "3D", "Dolby Atmos"];

// Generate time options in 30-minute intervals
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      times.push(time);
    }
  }
  return times;
};

const TIME_OPTIONS = generateTimeOptions();

const ScreenForm = ({ open, onClose, onSubmit, screen, theatreId }) => {
  const [formData, setFormData] = useState({
    screen_name: "",
    screen_type: "",
    seating_capacity: "",
    facilities: [],
    show_timings: [],
  });

  const [newShowTime, setNewShowTime] = useState({
    start_time: "",
    end_time: "",
  });

  const [errors, setErrors] = useState({});

  // Reset form when screen prop changes
  useEffect(() => {
    if (screen) {
      setFormData({
        screen_name: screen.screen_name || "",
        screen_type: screen.screen_type || "",
        seating_capacity: screen.seating_capacity || "",
        facilities: screen.facilities || [],
        show_timings: screen.show_timings || [],
      });
    } else {
      setFormData({
        screen_name: "",
        screen_type: "",
        seating_capacity: "",
        facilities: [],
        show_timings: [],
      });
    }
    setNewShowTime({ start_time: "", end_time: "" });
    setErrors({});
  }, [screen]);

  const validateShowTime = (start, end) => {
    if (!start || !end) return "Both start and end times are required";

    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);

    if (startTime >= endTime) return "End time must be after start time";
    return null;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.screen_name.trim()) {
      newErrors.screen_name = "Screen name is required";
    }

    if (!formData.screen_type) {
      newErrors.screen_type = "Screen type is required";
    }

    if (!formData.seating_capacity || formData.seating_capacity < 1) {
      newErrors.seating_capacity = "Seating capacity must be at least 1";
    }

    if (formData.show_timings.length === 0) {
      newErrors.show_timings = "At least one show timing is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    setFormData({
      screen_name: "",
      screen_type: "",
      seating_capacity: "",
      facilities: [],
      show_timings: [],
    });
    setNewShowTime({ start_time: "", end_time: "" });
    setErrors({});
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const screenData = {
        ...formData,
        theatre_id: theatreId,
        seating_capacity: parseInt(formData.seating_capacity),
        show_timings: formData.show_timings.map((timing) => ({
          start_time: timing.start_time,
          end_time: timing.end_time,
        })),
      };
      onSubmit(screenData);
    }
  };

  const handleAddShowTime = () => {
    const error = validateShowTime(
      newShowTime.start_time,
      newShowTime.end_time
    );
    if (error) {
      setErrors((prev) => ({ ...prev, show_time: error }));
      return;
    }

    // Check for time conflicts
    const hasConflict = formData.show_timings.some((timing) => {
      const newStart = new Date(`2000-01-01T${newShowTime.start_time}`);
      const newEnd = new Date(`2000-01-01T${newShowTime.end_time}`);
      const existingStart = new Date(`2000-01-01T${timing.start_time}`);
      const existingEnd = new Date(`2000-01-01T${timing.end_time}`);

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });

    if (hasConflict) {
      setErrors((prev) => ({
        ...prev,
        show_time: "Time slot conflicts with existing show",
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      show_timings: [
        ...prev.show_timings,
        {
          start_time: newShowTime.start_time,
          end_time: newShowTime.end_time,
        },
      ],
    }));
    setNewShowTime({ start_time: "", end_time: "" });
    setErrors((prev) => ({ ...prev, show_time: null }));
  };

  const handleRemoveShowTime = (index) => {
    setFormData((prev) => ({
      ...prev,
      show_timings: prev.show_timings.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{screen ? "Edit Screen" : "Add New Screen"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Screen Name"
                value={formData.screen_name}
                onChange={(e) =>
                  setFormData({ ...formData, screen_name: e.target.value })
                }
                error={!!errors.screen_name}
                helperText={errors.screen_name}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.screen_type} required>
                <InputLabel>Screen Type</InputLabel>
                <Select
                  value={formData.screen_type}
                  onChange={(e) =>
                    setFormData({ ...formData, screen_type: e.target.value })
                  }
                  label="Screen Type"
                >
                  {SCREEN_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.screen_type && (
                  <FormHelperText>{errors.screen_type}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Seating Capacity"
                type="number"
                value={formData.seating_capacity}
                onChange={(e) =>
                  setFormData({ ...formData, seating_capacity: e.target.value })
                }
                error={!!errors.seating_capacity}
                helperText={errors.seating_capacity}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Facilities</InputLabel>
                <Select
                  multiple
                  name="facilities"
                  value={formData.facilities}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      facilities: Array.isArray(e.target.value)
                        ? e.target.value
                        : [],
                    }))
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  label="Facilities"
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
              <Typography variant="subtitle1" gutterBottom>
                Show Timingss
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <FormControl fullWidth>
                  <InputLabel>Start Time</InputLabel>
                  <Select
                    value={newShowTime.start_time}
                    onChange={(e) =>
                      setNewShowTime((prev) => ({
                        ...prev,
                        start_time: e.target.value,
                      }))
                    }
                    label="Start Time"
                  >
                    {TIME_OPTIONS.map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>End Time</InputLabel>
                  <Select
                    value={newShowTime.end_time}
                    onChange={(e) =>
                      setNewShowTime((prev) => ({
                        ...prev,
                        end_time: e.target.value,
                      }))
                    }
                    label="End Time"
                  >
                    {TIME_OPTIONS.map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <IconButton
                  color="primary"
                  onClick={handleAddShowTime}
                  disabled={!newShowTime.start_time || !newShowTime.end_time}
                >
                  <AddIcon />
                </IconButton>
              </Stack>
              {errors.show_time && (
                <FormHelperText error>{errors.show_time}</FormHelperText>
              )}

              <Box sx={{ mt: 2 }}>
                {formData.show_timings.map((timing, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <Typography>
                      {timing.start_time} - {timing.end_time}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveShowTime(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
              {errors.show_timings && (
                <FormHelperText error>{errors.show_timings}</FormHelperText>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {screen ? "Update" : "Add"} Screen
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ScreenForm;
