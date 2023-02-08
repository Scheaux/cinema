import { useGetEverySessionMutation } from '@/redux/api'
import { selectMovie } from '@/redux/movies'
import {
    setAddMoviePopup,
    setDeleteMoviePopup,
    setDeleteShowtimePopup,
    setShowtimeAddPopup,
} from '@/redux/popups'
import { setSelectedSchedule, setSessions } from '@/redux/sessions'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Store } from 'react-notifications-component'
import { useDispatch, useSelector } from 'react-redux'
import { v4 } from 'uuid'

function MoviesConfig() {
    const { movies } = useSelector((state) => state.movies)
    const { halls } = useSelector((state) => state.halls)
    const { sessions } = useSelector((state) => state.sessions)
    const [showtimes, setShowtimes] = useState([])
    const dispatch = useDispatch()
    const [getAllSessions, { data: sessionsData, error: sessionsError }] =
        useGetEverySessionMutation()

    useEffect(() => {
        if (halls.length > 0) {
            getAllSessions()
        }
    }, [halls])

    useEffect(() => {
        if (sessionsData) {
            dispatch(setSessions(sessionsData))
        }

        if (sessionsError) {
            Store.addNotification({
                title: `Ошибка ${error.status}`,
                message: 'не удалось обновить сеансы',
                type: 'danger',
                insert: 'top',
                container: 'top-center',
                animationIn: ['animate__animated', 'animate__fadeIn'],
                animationOut: ['animate__animated', 'animate__fadeOut'],
                dismiss: {
                    duration: 5000,
                    onScreen: true,
                },
            })
        }
    }, [sessionsData, sessionsError])

    useEffect(() => {
        const _sessions = []
        sessions.map((session) => {
            if (
                _sessions.find(
                    (x) =>
                        x?.hall?.id === session.hallId &&
                        x?.date === session.date
                )
            ) {
                _sessions
                    .find(
                        (x) =>
                            x?.hall.id === session.hallId &&
                            x?.date === session.date
                    )
                    .schedule.push({
                        movie: movies.find(
                            (movie) => movie.id === session.movieId
                        ),
                        time: session.time,
                        sessionId: session.id,
                    })
            } else {
                _sessions.push({
                    hall: halls.find((hall) => hall.id === session.hallId),
                    date: session.date,
                    schedule: [
                        {
                            movie: movies.find(
                                (movie) => movie.id === session.movieId
                            ),
                            time: session.time,
                            sessionId: session.id,
                        },
                    ],
                })
            }
        })
        setShowtimes(_sessions)
    }, [sessions])

    function addMoviePopup(evt) {
        evt.preventDefault()
        dispatch(setAddMoviePopup(true))
    }

    function handleClick(movie) {
        dispatch(setShowtimeAddPopup(true))
        dispatch(selectMovie(movie))
    }

    function getOffsetFromTime(time) {
        if (time) {
            let pixels = 0
            const split = time.split(':')
            const hours = split[0]
            const mins = split[1]
            pixels += +hours * 30
            pixels += +mins * 0.5
            return `${pixels}px`
        }
    }

    function getWidthFromDuration(duration) {
        let pixels = 0
        pixels += duration * 0.5
        return `${pixels}px`
    }

    function handleDeletion(schedule) {
        dispatch(setSelectedSchedule(schedule))
        dispatch(setDeleteShowtimePopup(true))
    }

    function handleMovieDeletion(evt, movie) {
        evt.preventDefault()
        evt.stopPropagation()
        dispatch(selectMovie(movie))
        dispatch(setDeleteMoviePopup(true))
    }

    return (
        <>
            <section className="conf-step">
                <header className="conf-step__header conf-step__header_opened">
                    <h2 className="conf-step__title">Сетка сеансов</h2>
                </header>
                <div className="conf-step__wrapper">
                    <p className="conf-step__paragraph">
                        <button
                            className="conf-step__button conf-step__button-accent"
                            onClick={addMoviePopup}
                        >
                            Добавить фильм
                        </button>
                    </p>

                    <div className="conf-step__movies">
                        {movies?.length > 0 &&
                            movies.map((movie) => {
                                return (
                                    <div
                                        className="conf-step__movie"
                                        onClick={() => handleClick(movie)}
                                        key={v4()}
                                    >
                                        {movie.poster && (
                                            <Image
                                                className="conf-step__movie-poster"
                                                alt="poster"
                                                src={movie.poster}
                                                width={38}
                                                height={50}
                                            />
                                        )}
                                        <h3 className="conf-step__movie-title">
                                            {movie.name}
                                        </h3>
                                        <p className="conf-step__movie-duration">
                                            {movie.duration} минут
                                        </p>
                                        <div
                                            className="close-movie-button"
                                            onClick={(evt) =>
                                                handleMovieDeletion(evt, movie)
                                            }
                                        ></div>
                                    </div>
                                )
                            })}
                    </div>

                    <div className="conf-step__seances">
                        {showtimes.map((showtime) => {
                            return (
                                <div
                                    className="conf-step__seances-hall"
                                    key={v4()}
                                >
                                    <h3 className="conf-step__seances-title">
                                        {`${showtime?.hall?.name} ${showtime?.date}`}
                                    </h3>
                                    <div className="conf-step__seances-timeline">
                                        {showtime.schedule &&
                                            showtime.schedule.map((x) => {
                                                return (
                                                    <div
                                                        key={v4()}
                                                        className="conf-step__seances-movie"
                                                        style={{
                                                            width: getWidthFromDuration(
                                                                x?.movie
                                                                    ?.duration
                                                            ),
                                                            backgroundColor:
                                                                'rgb(133, 255, 137)',
                                                            left: getOffsetFromTime(
                                                                x?.time
                                                            ),
                                                        }}
                                                        onClick={() =>
                                                            handleDeletion(x)
                                                        }
                                                    >
                                                        <p className="conf-step__seances-movie-title">
                                                            {x?.movie?.name}
                                                        </p>
                                                        <p className="conf-step__seances-movie-start">
                                                            {x?.time}
                                                        </p>
                                                    </div>
                                                )
                                            })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
        </>
    )
}

export default MoviesConfig
