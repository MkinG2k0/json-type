import style from "./Main.module.scss";
import {useEffect, useState} from "react";
import {usePersistedState} from "../../Hook/Hook";
import {CheckBox} from "../../Components/CheckBox/CheckBox";
import {Area} from "../../Components/Area/Area";
import {Button} from "../../Components/Button/Button";
import {Copy} from "../../Icon/Icon";
import {Parse, Preset} from "../../Helper/Helper";
import {Tools} from "../../Components/Tools/Tools";


export function Main() {
    /*
    vr1.
    1: [string-noValid]
    2: [string-valid]
    3: [string->obj]
    4: [obj=>array[][]]
    5: [array[][]=>string-validType]
    vr2
    1:[string=>string-validType]
    */

    const [inPut, setInPut] = useState('');
    const [outPut, setOutPut] = useState('');
    const [preset, setPreset] = usePersistedState<Preset>('preset', {})

    const parse = new Parse(preset)

    useEffect(() => {
        if (inPut) {
            parse.setStr(inPut)
            setOutPut(parse.strType)
        }
    }, [inPut, preset]);


    const onCopy = async () => {
        await navigator.clipboard.writeText(outPut) // уведу кинуть
    }

    return (
        <div className={style.wrap}>
            <div className={style.top}>
                <div className={style.tool}>
                    <Tools setPreset={setPreset} preset={preset}/>
                </div>
                <Button onClick={onCopy}>
                    <Copy/>
                </Button>
            </div>
            <div className={style.wrapArea}>
                <Area value={inPut} onChange={setInPut}/>
                <Area value={outPut} readOnly adaptiveHeight/>
            </div>
        </div>
    );
}

