import style from "./Main.module.scss";
import {useEffect, useState} from "react";


export default function Main() {

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
    const [prev, setPrev] = useState('');
    const [outPut, setOutPut] = useState('');

    useEffect(() => {
        const strType = setType(Object.entries(prev))
        setOutPut(strType)
    }, [prev])


    const setType = (objArr, initTabs = 0) => {
        const tabsSpace = initTabs
        const spaceStr = ' '.repeat(Math.max(tabsSpace, 0))
        let typeObj = `${spaceStr}{\n`

        for (let i = 0; i < objArr.length; i++) {
            const name = objArr[i][0]
            const value = objArr[i][1]
            if (typeof value === 'object') {
                const nextObj = setType(Object.entries(value), tabsSpace + 1)
                typeObj += `${spaceStr} ${name} :${nextObj},\n`
            } else typeObj += `${spaceStr} ${name} : ${typeof value},\n`
        }

        typeObj += `${spaceStr}}`

        return typeObj
    }

    const validObjString = (value) => {
        let newLine = '';

        for (let i = 0; i < value.length; i++) {
            const elem = value[i]
            const prev = value[i - 1]
            const next = value[i + 1]

            if (elem === ':' && prev !== '"') newLine += '"'
            newLine += elem
            if (elem === '{' && next !== '"') newLine += '"'
            else if (elem === ',') newLine += '"'
        }

        return newLine.replaceAll('\'', '"').replaceAll('\n', '')
    }

    const change = (e) => {
        const value = e.target.value
        setInPut(value)

        try {
            const obj = JSON.parse(validObjString(value))
            setPrev(obj)
        } catch (e) {
            setOutPut('error')
        }
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
};