import { useLoginMutation } from '@/redux/api'
import { useRouter } from 'next/router'
import React, { useEffect, useRef } from 'react'
import { ReactNotifications, Store } from 'react-notifications-component'

function Login() {
    const mail = useRef('')
    const password = useRef('')
    const router = useRouter()
    const [loginMutation, { data: loginData, error: loginError }] =
        useLoginMutation()

    async function onSubmit(evt) {
        evt.preventDefault()
        loginMutation({
            email: mail.current.value,
            password: password.current.value,
        })
    }

    useEffect(() => {
        if (loginData) {
            localStorage.setItem('ACCESS_TOKEN', loginData.token)
            router.push('/dashboard')
        }

        if (loginError) {
            Store.addNotification({
                title: `Ошибка ${loginError.status}`,
                message: 'возможно введен неверный логин или пароль',
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
    }, [loginData, loginError])

    return (
        <>
            <ReactNotifications />
            <section className="login">
                <header className="login__header">
                    <h2 className="login__title">Авторизация</h2>
                </header>
                <div className="login__wrapper">
                    <form
                        className="login__form"
                        acceptCharset="utf-8"
                        onSubmit={onSubmit}
                    >
                        <label className="login__label" htmlFor="mail">
                            E-mail
                            <input
                                ref={mail}
                                className="login__input"
                                type="mail"
                                placeholder="example@domain.xyz"
                                name="mail"
                                required
                            />
                        </label>
                        <label className="login__label" htmlFor="pwd">
                            Пароль
                            <input
                                ref={password}
                                className="login__input"
                                type="password"
                                placeholder=""
                                name="pwd"
                                required
                            />
                        </label>
                        <div className="text-center">
                            <input
                                value="Авторизоваться"
                                type="submit"
                                className="login__button"
                            />
                        </div>
                    </form>
                </div>
            </section>
        </>
    )
}

export default Login
