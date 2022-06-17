import {FC} from 'react'
import {CheckBox} from "../CheckBox/CheckBox";

interface ToolsProps {
    setPreset: any
    preset: any
}

export const Tools: FC<ToolsProps> = ({setPreset, preset}) => {

    const onTogglePreset = (value: boolean, name: string) => {
        setPreset({...preset, [name]: value})
    }

    return (
        <>
            <CheckBox
                title={'I in Interface name ?'}
                name={'nameI'}
                onChange={onTogglePreset}
                checked={preset?.nameI}
            />
            <CheckBox
                title={'Enable types'}
                name={'types'}
                onChange={onTogglePreset}
                checked={preset?.types}
            />
        </>
    )
}
