import {FC} from "react";
import style from "./CheckBox.module.scss";

interface CheckboxBoxProps {
    title: string
    checked?: boolean
    onChange?: (checked: boolean) => void
}

export const CheckBox: FC<CheckboxBoxProps> = ({title, onChange, checked}) => {

    const onChangeInput = (e) => {
        onChange && onChange(e.target.checked)
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
    onChange: () => {
    },
    checked: false
}