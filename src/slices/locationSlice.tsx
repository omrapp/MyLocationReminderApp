import { createSlice } from '@reduxjs/toolkit';
import { LocationItem } from '../data/LocationItem';

const locationSlice = createSlice({
    name: 'locations',
    initialState: {
        list: [] as LocationItem[],
    },
    reducers: {
        addLocation: (state, action) => {
            return {
                ...state,
                list: [...state.list, action.payload],
            };
        },
        deleteLocation: (state, action) => {
            state.list = state.list.filter(location => location.id !== action.payload);
        },
        updateLocation: (state, action) => {
            const index = state.list.findIndex(location => location.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = action.payload;
            }
        },
        clearLocations: (state) => {
            state.list = [];
        },
    },
});

export const {
    addLocation,
    deleteLocation,
    updateLocation,
    clearLocations
} = locationSlice.actions;

export default locationSlice.reducer;