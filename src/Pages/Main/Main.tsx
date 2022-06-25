import style from "./Main.module.scss";
import {useEffect, useState} from "react";
import {usePersistedState} from "../../Hook/Hook";
import {Area} from "../../Components/Area/Area";
import {Button} from "../../Components/Button/Button";
import {Copy} from "../../Icon/Icon";
import {Parse, Preset} from "../../Helper/Helper";
import {Tools} from "../../Components/Tools/Tools";
import {Notify} from "../../Components/Notify/Notify";
import {AreaColor} from "../../Components/Colorize/Colorize";


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

    const [inPut, setInPut] = useState(' {\n' +
        '    "id": 1,\n' +
        '    "arr": [1,2,3,""],\n' +
        '    "name": "Leanne Graham",\n' +
        '    "username": "Bret",\n' +
        '    "email": "Sincere@april.biz",\n' +
        '    "address": {\n' +
        '      "street": "Kulas Light",\n' +
        '      "suite": "Apt. 556",\n' +
        '      "city": "Gwenborough",\n' +
        '      "zipcode": "92998-3874",\n' +
        '      "geo": {\n' +
        '        "lat": "-37.3159",\n' +
        '        "lng": "81.1496"\n' +
        '      }\n' +
        '    },\n' +
        '    "phone": "1-770-736-8031 x56442",\n' +
        '    "website": "hildegard.org",\n' +
        '    "company": {\n' +
        '      "name": "Romaguera-Crona",\n' +
        '      "catchPhrase": "Multi-layered client-server neural-net",\n' +
        '      "bs": "harness real-time e-markets"\n' +
        '    }\n' +
        '  }');

    const [outPut, setOutPut] = useState('');
    const [notify, setNotify] = useState(false);
    const [outArr, setOutArr] = useState<any[]>([]);
    const [preset, setPreset] = usePersistedState<Preset>('preset', {})

    const parse = new Parse(preset)

    useEffect(() => {
        if (inPut) {
            parse.setStr(inPut)
            setOutPut(parse.strType)
            setOutArr(parse.outArrType)
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
                <AreaColor arr={outArr}/>
            </div>
            <Notify active={notify}/>
        </div>
    );
}

