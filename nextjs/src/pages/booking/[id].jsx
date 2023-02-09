import {
    useFindBookingMutation,
    useGetHallByIdMutation,
    useGetMovieByIdMutation,
} from '@/redux/api'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { ReactNotifications, Store } from 'react-notifications-component'
import { v4 } from 'uuid'

function Booking() {
    const router = useRouter()
    const [ticket, setTicket] = useState(null)
    const { id } = router.query
    const [findBookingMutation, { data: ticketData, error: ticketError }] =
        useFindBookingMutation()
    const [getHallMutation, { data: hallData, error: hallError }] =
        useGetHallByIdMutation()
    const [getMovieMutation, { data: movieData, error: movieError }] =
        useGetMovieByIdMutation()
    const error = ticketError || hallError || movieError

    useEffect(() => {
        if (id) {
            findBookingMutation(id)
        }
    }, [id])

    useEffect(() => {
        if (ticketData) {
            getHallMutation(ticketData.hallId)
            getMovieMutation(ticketData.movieId)
            setTicket(ticketData)
        }
    }, [ticketData])

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

    return (
        <>
            <ReactNotifications />
            <header className="page-header">
                <h1 className="page-header__title">
                    Идём<span>в</span>кино
                </h1>
            </header>

            <main>
                {ticket && hallData && movieData && (
                    <section className="ticket">
                        <header className="tichet__check">
                            <h2 className="ticket__check-title">
                                Вы выбрали билеты:
                            </h2>
                        </header>

                        <div className="ticket__info-wrapper">
                            <p className="ticket__info">
                                На фильм:
                                <span className="ticket__details ticket__title">
                                    {` ${movieData.name}`}
                                </span>
                            </p>
                            <p className="ticket__info">
                                Места:
                                {ticket?.seats?.map((seat, i) => {
                                    return (
                                        <span
                                            className="ticket__details ticket__chairs"
                                            key={v4()}
                                        >
                                            {` (#${seat.row + 1}, ряд ${
                                                seat.col + 1
                                            })`}
                                            {i !== ticket.seats.length - 1
                                                ? ','
                                                : null}
                                        </span>
                                    )
                                })}
                            </p>
                            <p className="ticket__info">
                                В зале:
                                <span className="ticket__details ticket__hall">
                                    {` ${hallData.name} `}
                                </span>
                            </p>
                            <p className="ticket__info">
                                Начало сеанса:
                                <span className="ticket__details ticket__start">
                                    {` ${ticket.date} ${ticket.time} `}
                                </span>
                            </p>
                            <p className="ticket__info">
                                Стоимость:
                                <span className="ticket__details ticket__cost">
                                    {` ${ticket.totalPrice} `}
                                </span>
                                рублей
                            </p>

                            {ticket?.qr && (
                                <>
                                    <Image
                                        className="ticket__info-qr"
                                        src={`data:image/png;base64,${ticket.qr}`}
                                        width={100}
                                        height={100}
                                        alt="QR code"
                                    />
                                    <p className="ticket__hint">
                                        Покажите QR-код нашему контроллеру для
                                        подтверждения бронирования.
                                    </p>
                                    <p className="ticket__hint">
                                        Приятного просмотра!
                                    </p>
                                </>
                            )}
                        </div>
                    </section>
                )}
            </main>
        </>
    )
}

export default Booking
