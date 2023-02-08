import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import closeIcon from '../../i/close.png'
import { Store } from 'react-notifications-component'
import { useDispatch } from 'react-redux'
import { setMovies } from '@/redux/movies'
import { setAddMoviePopup } from '@/redux/popups'
import { useAddMovieMutation } from '@/redux/api'

function AddMoviePopup() {
    const dispatch = useDispatch()
    const nameRef = useRef()
    const durationRef = useRef()
    const countryRef = useRef()
    const descriptionRef = useRef()
    const posterRef = useRef()
    const [poster, setPoster] = useState(null)
    const [addMovieMutation, { data: moviesData, error: moviesError }] =
        useAddMovieMutation()

    function dismissPopup(evt) {
        evt.preventDefault()
        dispatch(setAddMoviePopup(false))
    }

    function handleClick() {
        addMovieMutation({
            name: nameRef.current.value,
            duration: durationRef.current.value,
            country: countryRef.current.value,
            description: descriptionRef.current.value,
            poster: poster,
        })
    }

    useEffect(() => {
        if (moviesData) {
            dispatch(setAddMoviePopup(false))
            dispatch(setMovies(moviesData))
            Store.addNotification({
                title: 'Фильм добавлен',
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

        if (moviesError) {
            Store.addNotification({
                title: `Ошибка ${moviesError.status}`,
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
    }, [moviesData, moviesError])

    function handleChange(evt) {
        const reader = new FileReader()
        reader.readAsDataURL(evt.target.files[0])
        reader.addEventListener('load', () => {
            setPoster(reader.result)
        })
    }

    return (
        <div className="popup active">
            <div className="popup__container">
                <div className="popup__content">
                    <div className="popup__header">
                        <h2 className="popup__title">
                            Добавление фильма
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
                            action="add_movie"
                            method="post"
                            acceptCharset="utf-8"
                        >
                            <label
                                className="conf-step__label conf-step__label-fullsize"
                                htmlFor="name"
                            >
                                Название фильма
                                <input
                                    className="conf-step__input"
                                    type="text"
                                    placeholder="Например &laquo;Гражданин Кейн&raquo;"
                                    name="name"
                                    ref={nameRef}
                                    required
                                />
                            </label>

                            <label
                                className="conf-step__label conf-step__label-fullsize"
                                htmlFor="description"
                            >
                                Описание
                                <input
                                    className="conf-step__input"
                                    type="text"
                                    name="description"
                                    ref={descriptionRef}
                                    required
                                />
                            </label>

                            <label
                                className="conf-step__label conf-step__label-fullsize"
                                htmlFor="duration"
                            >
                                Длительность (минут)
                                <input
                                    className="conf-step__input"
                                    min="1"
                                    max="999"
                                    type="number"
                                    name="duration"
                                    ref={durationRef}
                                    required
                                />
                            </label>

                            <label
                                className="conf-step__label conf-step__label-fullsize"
                                htmlFor="country"
                            >
                                Страна
                                <input
                                    className="conf-step__input"
                                    type="text"
                                    name="country"
                                    placeholder="Например &laquo;Австралия&raquo;"
                                    ref={countryRef}
                                    required
                                />
                            </label>

                            <label
                                className="conf-step__label conf-step__label-fullsize"
                                htmlFor="poster"
                            >
                                Постер
                                <input
                                    className="conf-step__input"
                                    type="file"
                                    name="poster"
                                    accept=".jpg, .jpeg, .png"
                                    onChange={handleChange}
                                    ref={posterRef}
                                />
                            </label>

                            <div className="conf-step__buttons text-center">
                                <input
                                    type="button"
                                    value="Добавить фильм"
                                    className="conf-step__button conf-step__button-accent"
                                    onClick={handleClick}
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

export default AddMoviePopup
