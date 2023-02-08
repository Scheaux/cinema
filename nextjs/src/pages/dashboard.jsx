import React, { useEffect, useState } from 'react'
import { ReactNotifications } from 'react-notifications-component'
import { useDispatch, useSelector } from 'react-redux'
import { set } from '@/redux/halls'
import AddMoviePopup from '@/components/popups/AddMoviePopup'
import ShowtimeAddPopup from '@/components/popups/ShowtimeAddPopup'
import DeleteShowtimePopup from '@/components/popups/DeleteShowtimePopup'
import DeleteMoviePopup from '@/components/popups/DeleteMoviePopup'
import AddHallPopup from '@/components/popups/AddHallPopup'
import DeleteHallPopup from '@/components/popups/DeleteHallPopup'
import HallList from '../components/halls/HallList'
import HallConfig from '../components/halls/HallConfig'
import PriceConfig from '../components/halls/PriceConfig'
import MoviesConfig from '../components/halls/MoviesConfig'
import { setMovies } from '@/redux/movies'
import { Store } from 'react-notifications-component'
import { setAddHallPopup } from '@/redux/popups'
import { useRouter } from 'next/router'
import {
    useActivateHallsMutation,
    useDeactivateHallsMutation,
    useGetAllHallsQuery,
    useGetAllMoviesQuery,
    useLogoutMutation,
} from '@/redux/api'

function dashboard() {
    const router = useRouter()
    const popups = useSelector((state) => state.popups)
    const { halls } = useSelector((state) => state.halls)
    const [status, setStatus] = useState(1)
    const dispatch = useDispatch()
    const { data: allHalls, error: hallsError } = useGetAllHallsQuery()
    const { data: allMovies, error: moviesError } = useGetAllMoviesQuery()
    const error = hallsError || moviesError
    const [deactivateHalls] = useDeactivateHallsMutation()
    const [activateHalls] = useActivateHallsMutation()
    const [logoutMutation, { isSuccess: isSuccessLogout }] = useLogoutMutation()

    useEffect(() => {
        if (!localStorage.getItem('ACCESS_TOKEN')) router.push('/')
    }, [])

    useEffect(() => {
        if (allHalls && allMovies) {
            dispatch(set(allHalls))
            dispatch(setMovies(allMovies))
        }

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
    }, [allHalls, allMovies])

    useEffect(() => {
        if (halls.length > 0) {
            setStatus(halls[0].is_active)
        }
    }, [halls])

    function createHallPopup() {
        dispatch(setAddHallPopup(true))
    }

    function switchHalls() {
        if (status === 1) {
            deactivateHalls()
            setStatus(0)
        } else {
            activateHalls()
            setStatus(1)
        }
    }

    function onLogout() {
        logoutMutation()
    }

    useEffect(() => {
        if (isSuccessLogout) {
            localStorage.removeItem('ACCESS_TOKEN')
            router.push('/')
        }
    }, [isSuccessLogout])

    return (
        <>
            <ReactNotifications />

            {popups.addHallPopup && <AddHallPopup />}
            {popups.deleteHallPopup && <DeleteHallPopup />}
            {popups.addMoviePopup && <AddMoviePopup />}
            {popups.deleteMoviePopup && <DeleteMoviePopup />}
            {popups.showtimeAddPopup && <ShowtimeAddPopup />}
            {popups.deleteShowtimePopup && <DeleteShowtimePopup />}

            <>
                <header className="page-header">
                    <h1 className="page-header__title">
                        Идём<span>в</span>кино
                    </h1>
                    <div>
                        <span className="page-header__subtitle">
                            Администраторррская
                        </span>
                        <div>
                            <button
                                className="conf-step__button conf-step__button-accent"
                                onClick={onLogout}
                            >
                                Выйти
                            </button>
                        </div>
                    </div>
                </header>
                <main className="conf-steps">
                    <section className="conf-step">
                        <header className="conf-step__header conf-step__header_opened">
                            <h2 className="conf-step__title">
                                Управление залами
                            </h2>
                        </header>
                        <div className="conf-step__wrapper">
                            <HallList halls={halls} />
                            <button
                                className="conf-step__button conf-step__button-accent"
                                onClick={createHallPopup}
                            >
                                Создать зал
                            </button>
                        </div>
                    </section>

                    <HallConfig halls={halls} />

                    <PriceConfig halls={halls} />

                    <MoviesConfig />

                    <section className="conf-step">
                        <header className="conf-step__header conf-step__header_opened">
                            <h2 className="conf-step__title">
                                Открыть продажи
                            </h2>
                        </header>
                        <div className="conf-step__wrapper text-center">
                            <p className="conf-step__paragraph">
                                Всё готово, теперь можно:
                            </p>
                            <button
                                className="conf-step__button conf-step__button-accent"
                                onClick={switchHalls}
                            >
                                {status ? 'Закрыть' : 'Открыть'} продажу билетов
                            </button>
                        </div>
                    </section>
                </main>
            </>
        </>
    )
}

export default dashboard
