import { useChangeHallMutation } from '@/redux/api'
import { set } from '@/redux/halls'
import React, { useEffect, useRef, useState } from 'react'
import { Store } from 'react-notifications-component'
import { useDispatch } from 'react-redux'
import { v4 } from 'uuid'
import HallSeats from './HallSeats'

function HallConfig({ halls }) {
    if (halls.length === 0) return
    const [selectedHall, setSelectedHall] = useState(halls[0])
    const [x, setX] = useState(
        selectedHall?.size?.x || process.env.NEXT_PUBLIC_DEFAULT_X_SIZE
    )
    const [y, setY] = useState(
        selectedHall?.size?.y || process.env.NEXT_PUBLIC_DEFAULT_Y_SIZE
    )
    const [columns, setColumns] = useState([])
    const xRef = useRef()
    const yRef = useRef()
    const [previous, setPrevious] = useState({ x, y })
    const dispatch = useDispatch()
    const [changeHallMutation, { data: hallsData, error: hallsError }] =
        useChangeHallMutation()

    function changeY(evt) {
        setY(evt.target.value)
    }

    function changeX(evt) {
        setX(evt.target.value)
    }

    function handleChange(hall) {
        setSelectedHall(hall)
    }

    function abortChanges() {
        if (selectedHall?.seats?.length > 0) {
            setColumns(selectedHall.seats)
        }
        xRef.current.value = selectedHall.size.x
        yRef.current.value = selectedHall.size.y
        setPrevious({ x: selectedHall.size.x, y: selectedHall.size.y })
        setX(selectedHall.size.x)
        setY(selectedHall.size.y)
    }

    function handleSubmit(evt) {
        evt.preventDefault()

        changeHallMutation({
            body: {
                size: {
                    x: xRef.current.value,
                    y: yRef.current.value,
                },
                seats: columns,
            },
            id: selectedHall.id,
        })
    }

    useEffect(() => {
        if (hallsData) {
            const _halls = JSON.parse(JSON.stringify(halls))
            const target = _halls.find((hall) => hall.id === hallsData.id)
            Object.assign(target, hallsData)
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
        <>
            <section className="conf-step">
                <header className="conf-step__header conf-step__header_opened">
                    <h2 className="conf-step__title">Конфигурация залов</h2>
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
                                        name="chairs-hall"
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
                        Укажите количество рядов и максимальное количество
                        кресел в ряду:
                    </p>
                    <div className="conf-step__legend">
                        <label className="conf-step__label">
                            Рядов, шт
                            <input
                                type="number"
                                min={0}
                                className="conf-step__input"
                                defaultValue={x}
                                onChange={changeX}
                                ref={xRef}
                            />
                        </label>
                        <span className="multiplier">x</span>
                        <label className="conf-step__label">
                            Мест, шт
                            <input
                                type="number"
                                min={0}
                                className="conf-step__input"
                                defaultValue={y}
                                onChange={changeY}
                                ref={yRef}
                            />
                        </label>
                    </div>
                    <p className="conf-step__paragraph">
                        Теперь вы можете указать типы кресел на схеме зала:
                    </p>
                    <div className="conf-step__legend">
                        <span className="conf-step__chair conf-step__chair_standart"></span>{' '}
                        — обычные кресла
                        <span className="conf-step__chair conf-step__chair_vip"></span>{' '}
                        — VIP кресла
                        <span className="conf-step__chair conf-step__chair_disabled"></span>{' '}
                        — заблокированные (нет кресла)
                        <p className="conf-step__hint">
                            Чтобы изменить вид кресла, нажмите по нему левой
                            кнопкой мыши
                        </p>
                    </div>

                    <HallSeats
                        hall={selectedHall}
                        {...{
                            x,
                            y,
                            setX,
                            setY,
                            xRef,
                            yRef,
                            columns,
                            setColumns,
                            previous,
                            setPrevious,
                        }}
                    />

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

export default HallConfig
