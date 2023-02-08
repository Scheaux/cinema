import { configureStore } from '@reduxjs/toolkit'
import hallsReducer from './halls'
import moviesReducer from './movies'
import sessionReducer from './sessions'
import popupReducer from './popups'
import { api } from './api'

export default configureStore({
    reducer: {
        halls: hallsReducer,
        movies: moviesReducer,
        sessions: sessionReducer,
        popups: popupReducer,
        [api.reducerPath]: api.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
})
