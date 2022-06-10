import style from "src/Pages/Inputs/Inputs.module.scss";
import {useState} from "react";
import {type} from "os";

export function Inputs() {

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
// ! not Work Array

    const [inPut, setInPut] = useState('');
    const [outPut, setOutPut] = useState('');

    const change = (e) => {
        const value = e.target.value
        let validType = ''

        const isObject = RegExp(/\{/).test(validType) && RegExp(/\}/).test(validType)

        if (isObject) {
            validType = validType.replaceAll(/:\s*(false|true)/g, ': boolean')
            validType = validType.replaceAll(/:\s*\d+/g, ': number')
            validType = validType.replaceAll(/:\s*'\b\.\b'/g, ': string') // '' dont work
        } else validType = 'error'

        setInPut(value)
        setOutPut(validType)
    }

    return (
        <div className={style.wrap}>
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