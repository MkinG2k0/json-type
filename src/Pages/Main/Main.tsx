import style from "./Main.module.scss";
import {useState} from "react";
import {changeObj,} from "../../Helper/Helper";
import {usePersistedState} from "../../Hook/Hook";


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


    const change = (e) => {
        const value = e.target.value
        setInPut(value)
        setOutPut(changeObj(value, nameI))
    }

    const onClick = () => {
        setNameI(!nameI)
        setOutPut(changeObj(inPut, nameI))
    }

    return (
        <div className={style.wrap}>
            <button onClick={onClick}>I</button>
            <textarea
                className={style.area}
                value={inPut}
                onChange={change}
            />
            <textarea
                className={style.area}
                value={outPut}
                readOnly={true}
            />
        </div>
    );
}