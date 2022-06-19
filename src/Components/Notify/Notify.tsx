import style from './Notify.module.scss'
import {FC} from 'react'

interface NotifyProps {
    active: boolean
}

export const Notify: FC<NotifyProps> = ({active}) => {
    const classNotify = style.wrapNotify + ' ' + (active ? style.notifyActive : ' ')

    return (
        <div className={classNotify}>
            Copied !
        </div>
    )
}

