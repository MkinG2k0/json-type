import {FC,} from "react";
import style from "./CheckBox.module.scss";

interface CheckboxBoxProps {
    name?: string
    title: string
    checked?: boolean
    onChange?: (checked: boolean, name) => void
}

export const CheckBox: FC<CheckboxBoxProps> = ({title, name, onChange, checked}) => {


    const onChangeInput = (e) => {
        onChange && onChange(e.target.checked, name)

    }

    return (
        <div className={style.wrap}>
            <input
                id={title}
                type={'checkbox'}
                checked={checked}
                onChange={onChangeInput}
                className={style['custom-checkbox']}
            />
            <label htmlFor={title}>{title}</label>
        </div>
    )
}

CheckBox.defaultProps = {
    name: 'CheckBox',
    onChange: () => {
    },
    checked: false
}