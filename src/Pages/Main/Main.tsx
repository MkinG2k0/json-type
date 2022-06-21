import style from "./Main.module.scss";
import {useEffect, useState} from "react";
import {usePersistedState} from "../../Hook/Hook";
import {Area} from "../../Components/Area/Area";
import {Button} from "../../Components/Button/Button";
import {Copy} from "../../Icon/Icon";
import {Parse, Preset} from "../../Helper/Helper";
import {Tools} from "../../Components/Tools/Tools";
import {Notify} from "../../Components/Notify/Notify";


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
    const [notify, setNotify] = useState(false);
    const [obj, setObj] = useState({});
    const [preset, setPreset] = usePersistedState<Preset>('preset', {})

    const parse = new Parse(preset)

    useEffect(() => {
        if (inPut) {
            parse.setStr(inPut)
            setOutPut(parse.strType)
            setObj(parse.obj)
        }
    }, [inPut, preset]);

    const onCopy = async () => {
        await navigator.clipboard.writeText(outPut)

        setNotify(true)

        setTimeout(() => {
            setNotify(false)
        }, 2000)
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
            <Colorize obj={obj}/>
            <Notify active={notify}/>
        </div>
    );
}

const Colorize = ({obj}) => {

    const colors = [
        ['interface', 'red']
    ]

    return (
        <div>
        </div>
    )
}

