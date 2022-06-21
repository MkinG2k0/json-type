import style from './Area.module.scss'
import {FC, useEffect, useRef, useState} from 'react'
import {useMount} from "../../Hook/Hook";

interface AreaProps {
    value: string
    onChange?: (value: string) => void
    readOnly?: boolean
    adaptiveHeight?: boolean

}

export const Area: FC<AreaProps> = ({value, readOnly, adaptiveHeight, onChange}) => {
    const ref = useRef<HTMLTextAreaElement>(null);
    const [height, setHeight] = useState('');
    const firsMount = useMount()

    useEffect(() => {
        if (ref.current && adaptiveHeight && firsMount) {
            setHeight(10 + ref.current.scrollHeight + 'px')
            ref.current.style.height = '0px'
        }
    }, [value]);


    const onChangeValue = (e) => {
        onChange && onChange(e.target.value)
    }

    return (
        <textarea
            className={style.wrap}
            value={value}
            ref={ref}
            style={{height}}
            onChange={onChangeValue}
            readOnly={readOnly}
        />
    )
}

Area.defaultProps = {
    adaptiveHeight: false,

    readOnly: false,
    onChange: () => {
    },
}

