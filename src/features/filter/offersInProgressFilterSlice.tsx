import {createSlice} from "@reduxjs/toolkit";

export const offersInProgressFilterSlice = createSlice( {
    name: "offersInProgressFilter",
    initialState: {
        offersInProgress: Array(0),
        category: "",
        experience: "",
        price: "",
        rating: "",
        location: "",
        status: "",
        search: ""

    },
    reducers: {
        setOffers: (state, action) => {
            state.offersInProgress = action.payload;
        },
        setFilteredCategory: (state, action) => {
            state.category = action.payload;
        },
        setFilteredExperience: (state, action) => {
            state.experience = action.payload;
        },
        setFilteredPrice: (state, action) => {
            state.price = action.payload;
        },
        setFilteredLocation: (state, action) => {
            state.location = action.payload;
        },
        setFilteredRating: (state, action) => {
            state.rating = action.payload;
        },
        setFilteredStatus: (state, action) => {
            state.status = action.payload;
        },
        setFilteredSearch: (state, action) => {
            state.search = action.payload;
        },
    }
})


export const {setOffers, setFilteredCategory, setFilteredLocation, setFilteredPrice, setFilteredRating, setFilteredExperience, setFilteredStatus, setFilteredSearch} = offersInProgressFilterSlice.actions;

export default offersInProgressFilterSlice.reducer;

export const selectCategory = (state: { offersInProgressFilter: { category: string; }; }) => state.offersInProgressFilter.category;
export const selectExperience = (state: { offersInProgressFilter: { experience: string; }; }) => state.offersInProgressFilter.experience;
export const selectRating = (state: { offersInProgressFilter: { rating: string; }; }) => state.offersInProgressFilter.rating;
export const selectLocation = (state: { offersInProgressFilter: { location: string; }; }) => state.offersInProgressFilter.location;
export const selectPrice = (state: { offersInProgressFilter: { price: string; }; }) => state.offersInProgressFilter.price;
export const selectStatus = (state: { offersInProgressFilter: { status: string; }; }) => state.offersInProgressFilter.status;
export const selectSearch = (state: { offersInProgressFilter: { search: string; }; }) => state.offersInProgressFilter.search;