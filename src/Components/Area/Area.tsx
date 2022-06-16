import style from './Area.module.scss'
import {FC} from 'react'

interface AreaProps {
    value: string
    onChange?: (value: string) => void
    readOnly?: boolean
}

export const Area: FC<AreaProps> = ({value, readOnly, onChange}) => {

    const onChangeValue = (e) => {
        onChange && onChange(e.target.value)
    }

    return (
        <textarea
            className={style.wrap}
            value={value}
            onChange={onChangeValue}
            readOnly={readOnly}
        />
    )
}

Area.defaultProps = {
    readOnly: false,
    onChange: () => {
    },
}