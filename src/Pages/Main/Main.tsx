import style from "./Main.module.scss";
import {useState} from "react";
import {changeObj,} from "../../Helper/Helper";
import {usePersistedState} from "../../Hook/Hook";
import {CheckBox} from "../../Components/CheckBox/CheckBox";
import {Area} from "../../Components/Area/Area";
import {Button} from "../../Components/Button/Button";
import {Copy} from "../../Icon/Icon";


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
    const [nameI, setNameI] = usePersistedState<boolean>('nameI', false)


    const change = (value) => {
        setInPut(value)
        setOutPut(changeObj(value, nameI))
    }

    const onToggleNameI = (value) => {
        setNameI(value) // err !value
        setOutPut(changeObj(inPut, nameI))
    }

    const onCopy = async () => {
        await navigator.clipboard.writeText(outPut) // уведу кинуть
    }

    return (
        <div className={style.wrap}>
            <div className={style.top}>
                <div className={style.tool}>
                    <CheckBox
                        title={'I in Interface name ?'}
                        onChange={onToggleNameI}
                        checked={nameI}
                    />
                    <CheckBox
                        title={'Enable types'}
                        onChange={onToggleNameI}
                        checked={nameI}
                    />
                </div>
                <Button onClick={onCopy}>
                    <Copy/>
                </Button>
            </div>
            <div className={style.wrapArea}>
                <Area value={inPut} onChange={change}/>
                <Area value={outPut} readOnly/>
            </div>
        </div>
    );
}

