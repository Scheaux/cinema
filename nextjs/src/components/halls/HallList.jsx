import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectHall } from '@/redux/halls'
import { setDeleteHallPopup } from '@/redux/popups'
import { v4 } from 'uuid'

function HallList({ halls }) {
    const dispatch = useDispatch()

    function deleteHallPopup(hall) {
        dispatch(selectHall(hall))
        dispatch(setDeleteHallPopup(true))
    }

    return (
        <>
            <p className="conf-step__paragraph">Доступные залы:</p>
            <ul className="conf-step__list">
                {halls.map((hall) => {
                    return (
                        <li key={v4()}>
                            <span>{hall.name}</span>
                            <button
                                className="conf-step__button conf-step__button-trash"
                                onClick={() => deleteHallPopup(hall)}
                            ></button>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

export default HallList
