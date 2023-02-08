import { useDeleteMovieMutation } from '@/redux/api'
import { selectMovie, setMovies } from '@/redux/movies'
import { setDeleteMoviePopup } from '@/redux/popups'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { Store } from 'react-notifications-component'
import { useDispatch, useSelector } from 'react-redux'
import closeIcon from '../../i/close.png'

function DeleteMoviePopup() {
    const { selectedMovie } = useSelector((state) => state.movies)
    const dispatch = useDispatch()
    const [deleteMovieMutation, { data: moviesData, error: moviesError }] =
        useDeleteMovieMutation()

    function dismissPopup(evt) {
        evt.preventDefault()
        dispatch(setDeleteMoviePopup(false))
        dispatch(selectMovie(null))
    }

    function handleSubmit() {
        deleteMovieMutation(selectedMovie.id)
    }

    useEffect(() => {
        if (moviesData) {
            dispatch(setDeleteMoviePopup(false))
            dispatch(selectMovie(null))
            dispatch(setMovies(moviesData))
            Store.addNotification({
                title: 'Фильм удален',
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

    return (
        <div className="popup active">
            <div className="popup__container">
                <div className="popup__content">
                    <div className="popup__header">
                        <h2 className="popup__title">
                            Удаление фильма
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
                                Вы действительно хотите удалить фильм
                                <span> {selectedMovie?.name} </span>?
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

export default DeleteMoviePopup
