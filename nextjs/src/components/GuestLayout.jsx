import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { ReactNotifications, Store } from 'react-notifications-component'
import { useDispatch, useSelector } from 'react-redux'
import { v4 } from 'uuid'
import { setMovies } from '@/redux/movies'
import { setSessions } from '@/redux/sessions'
import { set } from '@/redux/halls'
import Image from 'next/image'
import Link from 'next/link'
import { useGetAllQuery } from '@/redux/api'

function GuestLayout() {
    const [dates, setDates] = useState([])
    const [renderedDates, setRenderedDates] = useState([])
    const [startDay, setStartDay] = useState(0)
    const [chosenDay, setChosenDay] = useState(null)
    const { movies } = useSelector((state) => state.movies)
    const { halls } = useSelector((state) => state.halls)
    const { sessions } = useSelector((state) => state.sessions)
    const { data, error } = useGetAllQuery()
    const dispatch = useDispatch()
    const [showtimes, setShowtimes] = useState(null)

    useEffect(() => {
        if (sessions?.length > 0 && chosenDay) {
            const _showtimes = []
            for (let i = 0; i < sessions.length; i++) {
                if (moment(sessions[i].date).isSame(chosenDay, 'day')) {
                    const movie = movies.find(
                        (x) => x.id === sessions[i].movieId
                    )
                    const hall = halls.find((x) => x.id === sessions[i].hallId)
                    const existingMovie = _showtimes.find(
                        (x) => x.movie.id === sessions[i].movieId
                    )

                    if (existingMovie) {
                        const existingHall = existingMovie.halls.find(
                            (x) => x?.id === sessions[i].hallId
                        )
                        const _session = existingMovie.halls.find((x) =>
                            x.times.includes(sessions[i].time)
                        )

                        if (!existingHall) {
                            existingMovie.halls.push({
                                ...hall,
                                times: [sessions[i].time],
                            })
                        } else if (
                            !existingHall.times.includes(sessions[i].time)
                        ) {
                            existingHall.times.push(sessions[i].time)
                        }

                        if (_session) {
                            console.log(_session)
                        }
                    } else {
                        _showtimes.push({
                            movie,
                            halls: [{ ...hall, times: [sessions[i].time] }],
                        })
                    }
                    setShowtimes(_showtimes)
                }
            }
            if (_showtimes.length === 0) setShowtimes(null)
        }
    }, [chosenDay, sessions])

    useEffect(() => {
        if (data) {
            dispatch(setMovies(data.movies))
            dispatch(setSessions(data.sessions))
            dispatch(set(data.halls))
        }

        if (error) {
            Store.addNotification({
                title: `Ошибка ${error.status}`,
                type: 'danger',
                insert: 'top',
                container: 'top-right',
                animationIn: ['animate__animated', 'animate__fadeIn'],
                animationOut: ['animate__animated', 'animate__fadeOut'],
                dismiss: {
                    duration: 5000,
                    onScreen: true,
                },
            })
        }
    }, [data, error])

    useEffect(() => {
        const _dates = []
        const firstDay = moment()
        setChosenDay(firstDay)
        _dates.push(firstDay)
        for (let i = 1; i < process.env.NEXT_PUBLIC_RENDER_DAYS; i++) {
            _dates.push(moment().add(i, 'days'))
        }
        setDates(_dates)
    }, [])

    useEffect(() => {
        setRenderedDates(dates.slice(startDay, startDay + 7))
    }, [dates, startDay])

    function getDayOfTheWeek(date) {
        const dotw = moment(date).format('e')
        if (dotw === '1') return 'Пн'
        if (dotw === '2') return 'Вт'
        if (dotw === '3') return 'Ср'
        if (dotw === '4') return 'Чт'
        if (dotw === '5') return 'Пт'
        if (dotw === '6') return 'Сб'
        if (dotw === '0') return 'Вс'

        return null
    }

    function getNavClass(i, date) {
        return `${i === 0 ? 'page-nav__day_today' : null} ${
            moment(chosenDay).isSame(date) ? 'page-nav__day_chosen' : null
        } ${
            moment(date).format('e') === '6' || moment(date).format('e') === '0'
                ? 'page-nav__day_weekend'
                : null
        }`
    }

    function nextDay() {
        setStartDay(startDay + 1)
        const _renderedDates = renderedDates.slice(2)
        if (!_renderedDates.some((date) => moment(date).isSame(chosenDay))) {
            setChosenDay(_renderedDates[0])
        }
    }

    function prevDay() {
        setStartDay(startDay - 1)
        const _renderedDates = renderedDates.slice(0, 5)
        if (!_renderedDates.some((date) => moment(date).isSame(chosenDay))) {
            setChosenDay(_renderedDates[_renderedDates.length - 1])
        }
    }

    return (
        <>
            <ReactNotifications />
            <nav className="page-nav noselect">
                {renderedDates.map((date, i) => {
                    if (i > 7) return
                    if (i === 6 && i !== dates.length - startDay)
                        return (
                            <span
                                className="page-nav__day page-nav__day_next"
                                key={v4()}
                                onClick={nextDay}
                            ></span>
                        )
                    if (i === 0 && startDay !== 0)
                        return (
                            <span
                                className="page-nav__day page-nav__day_prev"
                                key={v4()}
                                onClick={prevDay}
                            ></span>
                        )
                    return (
                        <span
                            className={'page-nav__day ' + getNavClass(i, date)}
                            key={v4()}
                            onClick={() => setChosenDay(date)}
                        >
                            <span className="page-nav__day-week">
                                {getDayOfTheWeek(date)}
                            </span>
                            <span className="page-nav__day-number">
                                {moment(date).format('D')}
                            </span>
                        </span>
                    )
                })}
            </nav>

            {sessions?.length > 0 &&
                movies?.length > 0 &&
                halls?.length > 0 && (
                    <main>
                        {showtimes &&
                            showtimes.map((showtime) => {
                                return (
                                    <section className="movie" key={v4()}>
                                        <div className="movie__info">
                                            <div className="movie__poster">
                                                {showtime?.movie?.poster && (
                                                    <Image
                                                        fill
                                                        src={
                                                            showtime.movie
                                                                .poster
                                                        }
                                                        className="movie__poster-image"
                                                        alt="постер"
                                                    />
                                                )}
                                            </div>
                                            <div className="movie__description">
                                                <h2 className="movie__title">
                                                    {showtime?.movie?.name}
                                                </h2>
                                                <p className="movie__synopsis">
                                                    {
                                                        showtime?.movie
                                                            ?.description
                                                    }
                                                </p>
                                                <p className="movie__data">
                                                    <span className="movie__data-duration">
                                                        {`${showtime?.movie?.duration} минут `}
                                                    </span>
                                                    <span className="movie__data-origin">
                                                        {
                                                            showtime?.movie
                                                                ?.country
                                                        }
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        {showtime?.halls.map((hall) => {
                                            return (
                                                <div
                                                    className="movie-seances__hall"
                                                    key={v4()}
                                                >
                                                    <h3 className="movie-seances__hall-title">
                                                        {hall?.name}
                                                    </h3>
                                                    <ul className="movie-seances__list">
                                                        {hall?.times.map(
                                                            (time) => {
                                                                return (
                                                                    <li
                                                                        className="movie-seances__time-block"
                                                                        key={v4()}
                                                                    >
                                                                        <Link
                                                                            href={`/hall?hallId=${hall.id}&time=${time}&movieId=${showtime.movie.id}`}
                                                                            className="movie-seances__time"
                                                                        >
                                                                            {
                                                                                time
                                                                            }
                                                                        </Link>
                                                                    </li>
                                                                )
                                                            }
                                                        )}
                                                    </ul>
                                                </div>
                                            )
                                        })}
                                    </section>
                                )
                            })}
                    </main>
                )}
        </>
    )
}

export default GuestLayout
