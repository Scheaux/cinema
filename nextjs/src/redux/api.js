import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_HOST}/api`,
    }),
    endpoints: (build) => ({
        getAll: build.query({
            query: () => ({
                url: 'get-all',
            }),
        }),

        getAllHalls: build.query({
            query: () => ({
                url: 'halls',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(
                        'ACCESS_TOKEN'
                    )}`,
                },
            }),
        }),

        getAllMovies: build.query({
            query: () => ({
                url: 'movies',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(
                        'ACCESS_TOKEN'
                    )}`,
                },
            }),
        }),

        getAllSessions: build.query({
            query: () => ({
                url: 'sessions',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(
                        'ACCESS_TOKEN'
                    )}`,
                },
            }),
        }),

        getEverySession: build.mutation({
            query: () => ({
                url: 'sessions',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(
                        'ACCESS_TOKEN'
                    )}`,
                },
            }),
        }),

        activateHalls: build.mutation({
            query: () => ({
                url: 'activate-halls',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(
                        'ACCESS_TOKEN'
                    )}`,
                },
            }),
        }),

        deactivateHalls: build.mutation({
            query: () => ({
                url: 'deactivate-halls',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(
                        'ACCESS_TOKEN'
                    )}`,
                },
            }),
        }),

        register: build.mutation({
            query: (body) => ({
                method: 'POST',
                url: 'register',
                headers: {
                    Accept: 'application/json',
                },
                body,
            }),
        }),

        login: build.mutation({
            query: (body) => ({
                method: 'POST',
                url: 'login',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(
                        'ACCESS_TOKEN'
                    )}`,
                },
                body,
            }),
        }),

        logout: build.mutation({
            query: (body) => ({
                method: 'POST',
                url: 'logout',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(
                        'ACCESS_TOKEN'
                    )}`,
                },
            }),
        }),

        addHall: build.mutation({
            query: (body) => ({
                method: 'POST',
                url: `halls`,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(
                        'ACCESS_TOKEN'
                    )}`,
                },
                body,
            }),
        }),

        changeHall: build.mutation({
            query: ({ body, id }) => ({
                method: 'PUT',
                url: `halls/${id}`,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(
                        'ACCESS_TOKEN'
                    )}`,
                },
                body,
            }),
        }),

        deleteHall: build.mutation({
            query: (id) => ({
                method: 'DELETE',
                url: `halls/${id}`,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(
                        'ACCESS_TOKEN'
                    )}`,
                },
            }),
        }),

        addMovie: build.mutation({
            query: (body) => ({
                method: 'POST',
                url: `movies`,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(
                        'ACCESS_TOKEN'
                    )}`,
                },
                body,
            }),
        }),

        deleteMovie: build.mutation({
            query: (id) => ({
                method: 'DELETE',
                url: `movies/${id}`,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(
                        'ACCESS_TOKEN'
                    )}`,
                },
            }),
        }),

        addSession: build.mutation({
            query: (body) => ({
                method: 'POST',
                url: `sessions`,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(
                        'ACCESS_TOKEN'
                    )}`,
                },
                body,
            }),
        }),

        deleteSession: build.mutation({
            query: (id) => ({
                method: 'DELETE',
                url: `sessions/${id}`,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem(
                        'ACCESS_TOKEN'
                    )}`,
                },
            }),
        }),

        getHallById: build.mutation({
            query: (id) => ({
                url: `hall-by-id?id=${id}`,
                headers: {
                    Accept: 'application/json',
                },
            }),
        }),

        getMovieById: build.mutation({
            query: (id) => ({
                url: `movie-by-id?id=${id}`,
                headers: {
                    Accept: 'application/json',
                },
            }),
        }),

        getSessionByTime: build.mutation({
            query: (time) => ({
                url: `session-by-time?time=${time}`,
                headers: {
                    Accept: 'application/json',
                },
            }),
        }),

        getBookingByHallId: build.mutation({
            query: (hallId) => ({
                url: `booking-by-hallId?hallId=${hallId}`,
                headers: {
                    Accept: 'application/json',
                },
            }),
        }),

        createTicket: build.mutation({
            query: (body) => ({
                method: 'POST',
                url: 'create-ticket',
                headers: {
                    Accept: 'application/json',
                },
                body,
            }),
        }),
    }),
})

export const {
    useGetAllHallsQuery,
    useGetAllQuery,
    useGetAllSessionsQuery,
    useGetEverySessionMutation,
    useGetAllMoviesQuery,
    useActivateHallsMutation,
    useDeactivateHallsMutation,
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useAddHallMutation,
    useChangeHallMutation,
    useDeleteHallMutation,
    useAddMovieMutation,
    useDeleteMovieMutation,
    useAddSessionMutation,
    useDeleteSessionMutation,
    useGetHallByIdMutation,
    useGetMovieByIdMutation,
    useGetSessionByTimeMutation,
    useGetBookingByHallIdMutation,
    useCreateTicketMutation,
} = api
