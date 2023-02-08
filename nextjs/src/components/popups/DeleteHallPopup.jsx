import { useDeleteHallMutation } from '@/redux/api'
import { selectHall, set } from '@/redux/halls'
import { setDeleteHallPopup } from '@/redux/popups'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { Store } from 'react-notifications-component'
import { useDispatch, useSelector } from 'react-redux'
import closeIcon from '../../i/close.png'

function DeleteHallPopup() {
    const { selectedHall } = useSelector((state) => state.halls)
    const dispatch = useDispatch()
    const [deleteHallMutation, { data: hallsData, error: hallsError }] =
        useDeleteHallMutation()

    function dismissPopup(evt) {
        evt.preventDefault()
        dispatch(setDeleteHallPopup(false))
        dispatch(selectHall(null))
    }

    function deleteHall(evt) {
        evt.preventDefault()
        deleteHallMutation(selectedHall.id)
    }

    useEffect(() => {
        if (hallsData) {
            dispatch(selectHall(null))
            dispatch(setDeleteHallPopup(false))
            dispatch(set(hallsData))
            Store.addNotification({
                title: 'Зал удален',
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

        if (hallsError) {
            Store.addNotification({
                title: `Ошибка ${hallsError.status}`,
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
    }, [hallsData, hallsError])

    return (
        <div className="popup active">
            <div className="popup__container">
                <div className="popup__content">
                    <div className="popup__header">
                        <h2 className="popup__title">
                            Удаление зала
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
                        <form
                            action="delete_hall"
                            method="post"
                            acceptCharset="utf-8"
                        >
                            <p className="conf-step__paragraph">
                                Вы действительно хотите удалить
                                <span> {selectedHall?.name} </span>?
                            </p>
                            <div className="conf-step__buttons text-center">
                                <input
                                    type="submit"
                                    onClick={deleteHall}
                                    value="Удалить"
                                    className="conf-step__button conf-step__button-accent"
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

export default DeleteHallPopup
