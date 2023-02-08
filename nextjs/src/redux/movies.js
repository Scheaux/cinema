import { createSlice } from '@reduxjs/toolkit'

export const moviesSlice = createSlice({
    name: 'movies',
    initialState: {
        movies: [],
        selectedMovie: null,
    },
    reducers: {
        setMovies: (state, action) => {
            state.movies = action.payload
        },
        selectMovie: (state, action) => {
            state.selectedMovie = action.payload
        },
    },
})

export const { setMovies, selectMovie } = moviesSlice.actions

export default moviesSlice.reducer
