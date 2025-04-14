import React, { useState } from 'react';
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
} from '@mui/material';

const ScreenForm = ({ open, onClose, onSubmit, screen, theatreId }) => {
  const [formData, setFormData] = useState(screen ? {
    screen_name: screen.screen_name,
    screen_type: screen.screen_type,
    seating_capacity: screen.seating_capacity,
    facilities: screen.facilities || [],
  } : {
    screen_name: '',
    screen_type: '',
    seating_capacity: '',
    facilities: [],
  });

  const [facilityInput, setFacilityInput] = useState('');

  const screenTypes = ['2D', '3D', '4DX', 'IMAX'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const screenData = {
      ...formData,
      theatre: theatreId,
      seating_capacity: parseInt(formData.seating_capacity),
    };
    onSubmit(screenData);
  };

  const handleAddFacility = () => {
    if (facilityInput.trim()) {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, facilityInput.trim()],
      });
      setFacilityInput('');
    }
  };

  const handleRemoveFacility = (facilityToRemove) => {
    setFormData({
      ...formData,
      facilities: formData.facilities.filter(facility => facility !== facilityToRemove),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {screen ? 'Edit Screen' : 'Add New Screen'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Screen Name"
                value={formData.screen_name}
                onChange={(e) => setFormData({ ...formData, screen_name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Screen Type"
                value={formData.screen_type}
                onChange={(e) => setFormData({ ...formData, screen_type: e.target.value })}
                required
              >
                {screenTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Seating Capacity"
                type="number"
                value={formData.seating_capacity}
                onChange={(e) => setFormData({ ...formData, seating_capacity: e.target.value })}
                required
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add Facility"
                  value={facilityInput}
                  onChange={(e) => setFacilityInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFacility();
                    }
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.facilities.map((facility, index) => (
                  <Chip
                    key={index}
                    label={facility}
                    onDelete={() => handleRemoveFacility(facility)}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {screen ? 'Update' : 'Add'} Screen
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ScreenForm; 