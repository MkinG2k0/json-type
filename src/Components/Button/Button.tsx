import style from './Button.module.scss'
import {FC} from 'react'

interface ButtonProps {
    onClick: (name: string) => void
    name?: string
}

export const Button: FC<ButtonProps> = ({onClick, name, children}) => {

    const onClickBtn = () => {
        onClick(name || '')
    }

    return (
        <button onClick={onClickBtn} className={style.wrap}>
            {children}
        </button>
    )
}

Button.defaultProps = {
    name: 'btn',
    onClick: () => {
    }
}