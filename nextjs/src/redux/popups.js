import { createSlice } from '@reduxjs/toolkit'

export const popupSlice = createSlice({
    name: 'popups',
    initialState: {
        addHallPopup: false,
        deleteHallPopup: false,
        addMoviePopup: false,
        deleteMoviePopup: false,
        showtimeAddPopup: false,
        deleteShowtimePopup: false,
    },
    reducers: {
        setAddHallPopup: (state, action) => {
            state.addHallPopup = action.payload
        },
        setDeleteHallPopup: (state, action) => {
            state.deleteHallPopup = action.payload
        },
        setAddMoviePopup: (state, action) => {
            state.addMoviePopup = action.payload
        },
        setDeleteMoviePopup: (state, action) => {
            state.deleteMoviePopup = action.payload
        },
        setShowtimeAddPopup: (state, action) => {
            state.showtimeAddPopup = action.payload
        },
        setDeleteShowtimePopup: (state, action) => {
            state.deleteShowtimePopup = action.payload
        },
    },
})

export const {
    setAddHallPopup,
    setDeleteHallPopup,
    setAddMoviePopup,
    setDeleteMoviePopup,
    setShowtimeAddPopup,
    setDeleteShowtimePopup,
} = popupSlice.actions

export default popupSlice.reducer
