import { useAddSessionMutation } from '@/redux/api'
import { selectMovie } from '@/redux/movies'
import { setShowtimeAddPopup } from '@/redux/popups'
import { setSessions } from '@/redux/sessions'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { Store } from 'react-notifications-component'
import { useDispatch, useSelector } from 'react-redux'
import { v4 } from 'uuid'
import closeIcon from '../../i/close.png'

function ShowtimeAddPopup() {
    const { halls } = useSelector((state) => state.halls)
    const { selectedMovie } = useSelector((state) => state.movies)
    const [selectedHallId, setSelectedHallId] = useState('')
    const dispatch = useDispatch()
    const dateRef = useRef()
    const timeRef = useRef()
    const [addSessionMutation, { data: sessionData, error: sessionError }] =
        useAddSessionMutation()

    useEffect(() => {
        if (halls.length > 0) {
            setSelectedHallId(halls[0].id)
        }
    }, [halls])

    function dismissPopup(evt) {
        evt.preventDefault()
        dispatch(setShowtimeAddPopup(false))
        dispatch(selectMovie(null))
    }

    function handleChange(evt) {
        setSelectedHallId(evt.target.value)
    }

    function handleSubmit(evt) {
        evt.preventDefault()

        addSessionMutation({
            hallId: +selectedHallId,
            movieId: selectedMovie.id,
            date: dateRef.current.value,
            time: timeRef.current.value,
        })
    }

    useEffect(() => {
        if (sessionData) {
            dispatch(setShowtimeAddPopup(false))
            dispatch(selectMovie(null))
            dispatch(setSessions(sessionData))
            Store.addNotification({
                title: 'Сеанс добавлен',
                type: 'success',
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

        if (sessionError) {
            Store.addNotification({
                title: `Ошибка ${sessionError.status}`,
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
    }, [sessionData, sessionError])

    return (
        <>
            {halls.length > 0 && (
                <div className="popup active">
                    <div className="popup__container">
                        <div className="popup__content">
                            <div className="popup__header">
                                <h2 className="popup__title">
                                    Добавление сеанса
                                    <span className="popup__dismiss">
                                        <Image
                                            className="img"
                                            src={closeIcon}
                                            alt="Закрыть"
                                            onClick={dismissPopup}
                                        />
                                    </span>
                                </h2>
                            </div>
                            <div className="popup__wrapper">
                                <form acceptCharset="utf-8">
                                    <label
                                        className="conf-step__label conf-step__label-fullsize"
                                        htmlFor="hall"
                                    >
                                        Название зала
                                        <select
                                            className="conf-step__input"
                                            name="hall"
                                            value={selectedHallId}
                                            onChange={handleChange}
                                        >
                                            {halls.map((hall) => {
                                                return (
                                                    <option
                                                        value={hall.id}
                                                        key={v4()}
                                                    >
                                                        {hall.name}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    </label>
                                    <label
                                        className="conf-step__label conf-step__label-fullsize"
                                        htmlFor="start_time"
                                    >
                                        Время начала
                                        <input
                                            className="conf-step__input"
                                            type="time"
                                            defaultValue="00:00"
                                            ref={timeRef}
                                            name="start_time"
                                            required
                                        />
                                    </label>

                                    <label
                                        className="conf-step__label conf-step__label-fullsize"
                                        htmlFor="date"
                                    >
                                        Дата
                                        <input
                                            className="conf-step__input"
                                            type="date"
                                            ref={dateRef}
                                            name="date"
                                            required
                                        />
                                    </label>

                                    <div className="conf-step__buttons text-center">
                                        <input
                                            type="button"
                                            value="Добавить"
                                            className="conf-step__button conf-step__button-accent"
                                            onClick={handleSubmit}
                                        />
                                        <button
                                            className="conf-step__button conf-step__button-regular"
                                            onClick={dismissPopup}
                                        >
                                            Отменить
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ShowtimeAddPopup
