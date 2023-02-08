import { createSlice } from '@reduxjs/toolkit'

export const hallSlice = createSlice({
    name: 'halls',
    initialState: {
        halls: [],
        selectedHall: null,
    },
    reducers: {
        set: (state, action) => {
            state.halls = action.payload
        },
        selectHall: (state, action) => {
            state.selectedHall = action.payload
        },
    },
})

export const { set, selectHall } = hallSlice.actions

export default hallSlice.reducer
