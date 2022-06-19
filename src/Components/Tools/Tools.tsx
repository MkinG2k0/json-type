import {FC} from 'react'
import {CheckBox} from "../CheckBox/CheckBox";
import {Preset} from "../../Helper/Helper";

interface ToolsProps {
    setPreset: any
    preset?: Preset
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
                title={'Types'}
                name={'types'}
                onChange={onTogglePreset}
                checked={preset?.types}
            />
            <CheckBox
                title={'Commas'}
                name={'commas'}
                onChange={onTogglePreset}
                checked={preset?.commas}
            />
        </>
    )
}
