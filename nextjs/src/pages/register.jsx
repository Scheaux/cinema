import { useRegisterMutation } from '@/redux/api'
import { useRouter } from 'next/router'
import React, { useEffect, useRef } from 'react'
import { ReactNotifications, Store } from 'react-notifications-component'

function register() {
    const name = useRef('')
    const mail = useRef('')
    const password = useRef('')
    const passwordConfirmation = useRef('')
    const router = useRouter()
    const [registerMutation, { data: registerData, error: registerError }] =
        useRegisterMutation()

    function onSubmit(evt) {
        evt.preventDefault()

        registerMutation({
            name: name.current.value,
            email: mail.current.value,
            password: password.current.value,
            password_confirmation: password.current.value,
        })
    }

    useEffect(() => {
        if (registerData) {
            localStorage.setItem('ACCESS_TOKEN', registerData.token)
            router.push('/dashboard')
        }

        if (registerError) {
            Store.addNotification({
                title: `Ошибка ${registerError.status}`,
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
    }, [registerData, registerError])

    return (
        <>
            <ReactNotifications />
            <section className="login">
                <header className="login__header">
                    <h2 className="login__title">Регистрация</h2>
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
                        <label className="login__label" htmlFor="username">
                            Имя пользователя
                            <input
                                ref={name}
                                className="login__input"
                                type="text"
                                placeholder=""
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
                        <label className="login__label" htmlFor="pwdс">
                            Подтверждение пароля
                            <input
                                ref={passwordConfirmation}
                                className="login__input"
                                type="password"
                                placeholder=""
                                name="pwdc"
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

export default register
