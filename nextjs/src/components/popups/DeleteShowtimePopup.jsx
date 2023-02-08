import { useDeleteSessionMutation } from '@/redux/api'
import { setDeleteShowtimePopup } from '@/redux/popups'
import { setSelectedSchedule, setSessions } from '@/redux/sessions'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { Store } from 'react-notifications-component'
import { useDispatch, useSelector } from 'react-redux'
import closeIcon from '../../i/close.png'

function DeleteShowtimePopup() {
    const { selectedSchedule } = useSelector((state) => state.sessions)
    const dispatch = useDispatch()
    const [deleteSessionMutation, { data: sessionData, error: sessionError }] =
        useDeleteSessionMutation()

    function dismissPopup(evt) {
        evt.preventDefault()
        dispatch(setDeleteShowtimePopup(false))
        dispatch(setSelectedSchedule(null))
    }

    function handleSubmit() {
        deleteSessionMutation(selectedSchedule.sessionId)
    }

    useEffect(() => {
        if (sessionData) {
            dispatch(setDeleteShowtimePopup(false))
            dispatch(setSelectedSchedule(null))
            dispatch(setSessions(sessionData))
            Store.addNotification({
                title: 'Сеанс удален',
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
        <div className="popup active">
            <div className="popup__container">
                <div className="popup__content">
                    <div className="popup__header">
                        <h2 className="popup__title">
                            Снятие с сеанса
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
                            <p className="conf-step__paragraph">
                                Вы действительно хотите снять с сеанса фильм
                                <span> {selectedSchedule?.movie?.name} </span>?
                            </p>
                            <div className="conf-step__buttons text-center">
                                <input
                                    type="button"
                                    value="Удалить"
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
    )
}

export default DeleteShowtimePopup
