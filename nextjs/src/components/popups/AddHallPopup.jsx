import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import closeIcon from '../../i/close.png'
import { useDispatch } from 'react-redux'
import { set } from '@/redux/halls'
import { setAddHallPopup } from '@/redux/popups'
import { useAddHallMutation } from '@/redux/api'
import { Store } from 'react-notifications-component'

function AddHallPopup() {
    const dispatch = useDispatch()
    const hallName = useRef(null)
    const [addHallMutation, { data: hallsData, error: hallsError }] =
        useAddHallMutation()

    function dismissPopup(evt) {
        evt.preventDefault()
        dispatch(setAddHallPopup(false))
    }

    function onSubmit(evt) {
        evt.preventDefault()

        addHallMutation({
            name: hallName.current.value,
            size: {
                x: process.env.NEXT_PUBLIC_DEFAULT_X_SIZE,
                y: process.env.NEXT_PUBLIC_DEFAULT_Y_SIZE,
            },
        })
    }

    useEffect(() => {
        if (hallsData) {
            dispatch(setAddHallPopup(false))
            dispatch(set(hallsData))
            Store.addNotification({
                title: 'Зал добавлен',
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
                            Добавление зала
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
                        <form acceptCharset="utf-8" onSubmit={onSubmit}>
                            <label
                                className="conf-step__label conf-step__label-fullsize"
                                htmlFor="name"
                            >
                                Название зала
                                <input
                                    className="conf-step__inputв"
                                    type="text"
                                    placeholder="Например, &laquo;Зал 1&raquo;"
                                    name="name"
                                    ref={hallName}
                                    required
                                />
                            </label>
                            <div className="conf-step__buttons text-center">
                                <input
                                    type="submit"
                                    value="Добавить зал"
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

export default AddHallPopup
