import React, { useEffect, useState } from 'react'
import { v4 } from 'uuid'

function HallSeats({
    hall,
    x,
    y,
    setX,
    setY,
    setColumns,
    columns,
    xRef,
    yRef,
    previous,
    setPrevious,
}) {
    useEffect(() => {
        if (hall?.size) {
            setPrevious({ x: hall.size.x, y: hall.size.y })
            setX(hall.size.x)
            setY(hall.size.y)
            if (hall?.seats?.length >= 0 && hall?.size) {
                setColumns(hall.seats)
                xRef.current.value = hall.size.x
                yRef.current.value = hall.size.y
            } else if (hall.seats === null && hall?.size) {
                setColumns(generateColumns())
                xRef.current.value = hall.size.x
                yRef.current.value = hall.size.y
            }
        }
    }, [hall])

    useEffect(() => {
        let _columns = []

        if (hall?.seats?.length <= 0 || hall.seats === null) {
            _columns = generateColumns()
        } else if (columns.length > 0) {
            _columns = JSON.parse(JSON.stringify(columns))
        } else if (hall.seats) {
            _columns = JSON.parse(JSON.stringify(hall.seats))
        }

        if (+x > +previous.x && hall?.seats !== null) {
            for (let c = +previous.x; c < +x; c++) {
                const _rows = []
                for (let i = 0; i < +y; i++) {
                    _rows.push(1)
                }
                _columns.push(_rows)
            }
        } else if (+x < +previous.x && hall?.seats !== null) {
            for (let i = +x; i < +previous.x; i++) {
                _columns.pop()
            }
        } else if (+y > +previous.y && hall?.seats !== null) {
            for (let c = +previous.y; c < +y; c++) {
                for (let i = 0; i < +x; i++) {
                    _columns[i].push(1)
                }
            }
        } else if (+y < +previous.y && hall?.seats !== null) {
            for (let c = +y; c < +previous.y; c++) {
                for (let i = 0; i < +x; i++) {
                    _columns[i].pop()
                }
            }
        }

        setColumns(_columns)
        setPrevious({ x, y })
    }, [x, y])

    function handleClick(idx, i) {
        setColumns((clms) => {
            const copy = JSON.parse(JSON.stringify(clms))
            if (copy[idx][i] >= 2) copy[idx][i] = 0
            else copy[idx][i] += 1
            return copy
        })
    }

    function generateColumns() {
        let _columns = []
        for (let i = 0; i < +x; i++) {
            const _rows = []
            for (let i = 0; i < +y; i++) {
                _rows.push(1)
            }
            _columns.push(_rows)
        }
        return _columns
    }

    return (
        <div className="conf-step__hall">
            <div className="conf-step__hall-wrapper">
                {columns.map((rows, idx) => {
                    return (
                        <div className="conf-step__row" key={v4()}>
                            {rows.map((val, i) => {
                                let cls
                                if (val === 0) cls = 'conf-step__chair_disabled'
                                else if (val === 1)
                                    cls = 'conf-step__chair_standart'
                                else if (val === 2) cls = 'conf-step__chair_vip'
                                return (
                                    <span
                                        className={`conf-step__chair ${cls}`}
                                        onClick={() => handleClick(idx, i)}
                                        key={v4()}
                                    ></span>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default HallSeats
