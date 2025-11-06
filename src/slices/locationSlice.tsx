import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LocationItem } from '../types/LocationItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONSTANTS } from '../config/constants';

interface FetchPaginatedDataParams {
    page: number;
    itemsPerPage: number;
}

export const fetchPaginatedData = createAsyncThunk<any, FetchPaginatedDataParams>('locations/fetchPaginatedData',
    async ({ page, itemsPerPage }, { getState }) => {

        console.log(`fetchPaginatedData called ${page}, ${itemsPerPage}`)

        const storedDataString = await AsyncStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.LOCATIONS);
        if (storedDataString) {
            const fullData = JSON.parse(storedDataString);
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const paginatedData = fullData.slice(startIndex, endIndex);
            return { paginatedData, totalPages: Math.ceil(fullData.length / itemsPerPage), currentPage: page, };
        }
        return { paginatedData: [], totalPages: 0 };
    }
);

const locationSlice = createSlice({
    name: 'locations',
    initialState: {
        items: [] as LocationItem[],
        currentPage: 1,
        itemsPerPage: 10,
        totalPages: 0,
        status: 'idle',
        loading: false,
        error: '',
    },
    reducers: {
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        addLocation: (state, action) => {
            return {
                ...state,
                items: [...state.items, action.payload],
            };
        },
        deleteLocation: (state, action) => {
            state.items = state.items.filter(location => location.id !== action.payload);
        },
        updateLocation: (state, action) => {
            const index = state.items.findIndex(location => location.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        clearLocations: (state) => {
            state.items = [];
        },

        // ... other reducers for setting full data, etc.
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPaginatedData.pending, (state) => {
                state.loading = true;
                state.status = 'loading';
            })
            .addCase(fetchPaginatedData.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.loading = false;
                state.items = action.payload.paginatedData;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchPaginatedData.rejected, (state, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.error.message ?? 'undefined error';
            });
    },
});


// const locationSlice = createSlice({
//     name: 'locations',
//     initialState: {
//         list: [] as LocationItem[],
//     },
//     reducers: {
//         addLocation: (state, action) => {
//             return {
//                 ...state,
//                 list: [...state.list, action.payload],
//             };
//         },
//         deleteLocation: (state, action) => {
//             state.list = state.list.filter(location => location.id !== action.payload);
//         },
//         updateLocation: (state, action) => {
//             const index = state.list.findIndex(location => location.id === action.payload.id);
//             if (index !== -1) {
//                 state.list[index] = action.payload;
//             }
//         },
//         clearLocations: (state) => {
//             state.list = [];
//         },
//     },
// });

export const {
    setCurrentPage,
    addLocation,
    deleteLocation,
    updateLocation,
    clearLocations
} = locationSlice.actions;

export default locationSlice.reducer;