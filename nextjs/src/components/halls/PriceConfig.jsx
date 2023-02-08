import { useChangeHallMutation } from '@/redux/api'
import { set } from '@/redux/halls'
import React, { useEffect, useRef, useState } from 'react'
import { Store } from 'react-notifications-component'
import { useDispatch } from 'react-redux'
import { v4 } from 'uuid'

function PriceConfig({ halls }) {
    if (halls.length === 0) return
    const [selectedHall, setSelectedHall] = useState(halls[0])
    const stdPrice = useRef()
    const vipPrice = useRef()
    const dispatch = useDispatch()
    const [changeHallMutation, { data: hallData, error: hallError }] =
        useChangeHallMutation()

    function handleChange(hall) {
        setSelectedHall(hall)
        stdPrice.current.value = hall.standardPrice
        vipPrice.current.value = hall.vipPrice
    }

    function abortChanges() {
        stdPrice.current.value = selectedHall.standardPrice
        vipPrice.current.value = selectedHall.vipPrice
    }

    function handleSubmit() {
        changeHallMutation({
            id: selectedHall.id,
            body: {
                standardPrice: stdPrice.current.value,
                vipPrice: vipPrice.current.value,
            },
        })
    }

    useEffect(() => {
        if (hallData) {
            const _halls = JSON.parse(JSON.stringify(halls))
            const target = _halls.find((hall) => hall.id === hallData.id)
            Object.assign(target, hallData)
            dispatch(set(_halls))

            Store.addNotification({
                title: 'Данные обновлены',
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

        if (hallError) {
            Store.addNotification({
                title: `Ошибка ${hallError.status}`,
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
    }, [hallData, hallError])

    return (
        <>
            <section className="conf-step">
                <header className="conf-step__header conf-step__header_opened">
                    <h2 className="conf-step__title">Конфигурация цен</h2>
                </header>
                <div className="conf-step__wrapper">
                    <p className="conf-step__paragraph">
                        Выберите зал для конфигурации:
                    </p>
                    <ul className="conf-step__selectors-box">
                        {halls.map((hall, i) => {
                            return (
                                <li key={v4()}>
                                    <input
                                        type="radio"
                                        className="conf-step__radio"
                                        name="prices-hall"
                                        defaultValue={hall.name}
                                        defaultChecked={
                                            hall.id === selectedHall.id
                                        }
                                        onChange={() => handleChange(hall)}
                                    />
                                    <span className="conf-step__selector">
                                        {hall.name}
                                    </span>
                                </li>
                            )
                        })}
                    </ul>

                    <p className="conf-step__paragraph">
                        Установите цены для типов кресел:
                    </p>
                    <div className="conf-step__legend">
                        <label className="conf-step__label">
                            Цена, рублей
                            <input
                                type="text"
                                className="conf-step__input"
                                defaultValue={selectedHall.standardPrice}
                                ref={stdPrice}
                            />
                        </label>
                        за{' '}
                        <span className="conf-step__chair conf-step__chair_standart"></span>{' '}
                        обычные кресла
                    </div>
                    <div className="conf-step__legend">
                        <label className="conf-step__label">
                            Цена, рублей
                            <input
                                type="text"
                                className="conf-step__input"
                                defaultValue={selectedHall.vipPrice}
                                ref={vipPrice}
                            />
                        </label>
                        за{' '}
                        <span className="conf-step__chair conf-step__chair_vip"></span>{' '}
                        VIP кресла
                    </div>

                    <fieldset className="conf-step__buttons text-center">
                        <button
                            className="conf-step__button conf-step__button-regular"
                            onClick={abortChanges}
                        >
                            Отмена
                        </button>
                        <input
                            type="button"
                            value="Сохранить"
                            className="conf-step__button conf-step__button-accent"
                            onClick={handleSubmit}
                        />
                    </fieldset>
                </div>
            </section>
        </>
    )
}

export default PriceConfig
