import {
    useCreateTicketMutation,
    useGetBookingMutation,
    useGetHallByIdMutation,
    useGetMovieByIdMutation,
    useGetSessionByTimeMutation,
} from '@/redux/api'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { ReactNotifications, Store } from 'react-notifications-component'
import { v4 } from 'uuid'

function hall() {
    const router = useRouter()
    const { hallId, movieId, time, date } = router.query
    const [hall, setHall] = useState(null)
    const [movie, setMovie] = useState(null)
    const [session, setSession] = useState(null)
    const [seats, setSeats] = useState(null)
    const [chosenSeats, setChosenSeats] = useState([])
    const [getHallMutation, { data: hallData, error: hallError }] =
        useGetHallByIdMutation()
    const [getMovieMutation, { data: movieData, error: movieError }] =
        useGetMovieByIdMutation()
    const [getSessionMutation, { data: sessionData, error: sessionError }] =
        useGetSessionByTimeMutation()
    const [getBookingMutation, { data: bookingData, error: bookingError }] =
        useGetBookingMutation()
    const [createTicketMutation, { data: ticketData, error: ticketError }] =
        useCreateTicketMutation()
    const error =
        hallError || movieError || sessionError || bookingError || ticketError

    useEffect(() => {
        if (hallId && time && date) {
            getHallMutation(hallId)
            getBookingMutation({ hallId, time, date })
            getSessionMutation({ time, date })
        }
        if (movieId) getMovieMutation(movieId)
    }, [hallId, movieId, time, date])

    useEffect(() => {
        if (hallData) setHall(hallData)
        if (movieData) setMovie(movieData)
        if (sessionData) setSession(sessionData)
        if (bookingData) setSeats(bookingData.seats)
    }, [hallData, movieData, sessionData, bookingData])

    useEffect(() => {
        if (error) {
            Store.addNotification({
                title: `Ошибка ${error.status}`,
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
    }, [error])

    function selectSeat(rowIdx, colIdx) {
        const _seats = JSON.parse(JSON.stringify(seats))
        const seat = seats[colIdx][rowIdx]
        if (seat === 1 || seat === 2) {
            _seats[colIdx][rowIdx] = 4
            setChosenSeats((prev) => [...prev, { col: colIdx, row: rowIdx }])
        } else if (seat === 4) {
            const _seat = bookingData.seats[colIdx][rowIdx]
            _seats[colIdx][rowIdx] = _seat
            const unwantedIdx = chosenSeats.findIndex(
                (x) => x.col === colIdx && x.row === rowIdx
            )
            const _chosenSeats = JSON.parse(JSON.stringify(chosenSeats))
            _chosenSeats.splice(unwantedIdx, 1)
            setChosenSeats(_chosenSeats)
        }
        setSeats(_seats)
    }

    function handleClick() {
        createTicketMutation({
            hallId,
            movieId,
            time,
            date,
            seats: chosenSeats,
        })
    }

    useEffect(() => {
        if (ticketData) {
            router.push(`/booking/${ticketData.ticketId}`)
        }
    }, [ticketData])

    return (
        <>
            <ReactNotifications />
            <header className="page-header">
                <h1 className="page-header__title">
                    Идём<span>в</span>кино
                </h1>
            </header>

            {hall && movie && session && seats && (
                <main>
                    <section className="buying">
                        <div className="buying__info">
                            <div className="buying__info-description">
                                {movie && (
                                    <h2 className="buying__info-title">
                                        {movie.name}
                                    </h2>
                                )}
                                {session && (
                                    <p className="buying__info-start">
                                        {session.time}
                                    </p>
                                )}
                                {hall && (
                                    <p className="buying__info-hall">
                                        {hall.name}
                                    </p>
                                )}
                            </div>
                            <div className="buying__info-hint">
                                <p>
                                    Тапните дважды,
                                    <br />
                                    чтобы увеличить
                                </p>
                            </div>
                        </div>
                        <div className="buying-scheme">
                            <div className="buying-scheme__wrapper">
                                {seats?.map((col, colIdx) => {
                                    return (
                                        <div
                                            className="buying-scheme__row"
                                            key={v4()}
                                        >
                                            {col.map((row, rowIdx) => {
                                                let cls
                                                if (row === 0)
                                                    cls =
                                                        'buying-scheme__chair_disabled'
                                                else if (row === 1)
                                                    cls =
                                                        'buying-scheme__chair_standart'
                                                else if (row === 2)
                                                    cls =
                                                        'buying-scheme__chair_vip'
                                                else if (row === 3)
                                                    cls =
                                                        'buying-scheme__chair_taken'
                                                else if (row === 4)
                                                    cls =
                                                        'buying-scheme__chair_selected'
                                                return (
                                                    <span
                                                        className={`buying-scheme__chair ${cls}`}
                                                        key={v4()}
                                                        onClick={() =>
                                                            selectSeat(
                                                                rowIdx,
                                                                colIdx
                                                            )
                                                        }
                                                    ></span>
                                                )
                                            })}
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="buying-scheme__legend">
                                <div className="col">
                                    <p className="buying-scheme__legend-price">
                                        <span className="buying-scheme__chair buying-scheme__chair_standart"></span>
                                        Свободно (
                                        <span className="buying-scheme__legend-value">
                                            {hall.standardPrice}руб
                                        </span>
                                        )
                                    </p>
                                    <p className="buying-scheme__legend-price">
                                        <span className="buying-scheme__chair buying-scheme__chair_vip"></span>
                                        Свободно VIP (
                                        <span className="buying-scheme__legend-value">
                                            {hall.vipPrice}руб
                                        </span>
                                        )
                                    </p>
                                </div>
                                <div className="col">
                                    <p className="buying-scheme__legend-price">
                                        <span className="buying-scheme__chair buying-scheme__chair_taken"></span>
                                        <span> Занято </span>
                                    </p>
                                    <p className="buying-scheme__legend-price">
                                        <span className="buying-scheme__chair buying-scheme__chair_selected"></span>
                                        <span> Выбрано </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            className="acceptin-button"
                            onClick={handleClick}
                        >
                            Забронировать
                        </button>
                    </section>
                </main>
            )}
        </>
    )
}

export default hall
