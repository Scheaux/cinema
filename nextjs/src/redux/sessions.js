import { createSlice } from '@reduxjs/toolkit'

export const sessionsSlice = createSlice({
    name: 'sessions',
    initialState: {
        selectedSession: null,
        selectedSchedule: null,
        sessions: [],
    },
    reducers: {
        setSelectedSession: (state, action) => {
            state.selectedSession = action.payload
        },
        setSelectedSchedule: (state, action) => {
            state.selectedSchedule = action.payload
        },
        setSessions: (state, action) => {
            state.sessions = action.payload
        },
    },
})

export const { setSelectedSession, setSelectedSchedule, setSessions } =
    sessionsSlice.actions

export default sessionsSlice.reducer
