import style from "./Colorize.module.scss";
import {FC} from "react";


export const AreaColor = ({arr}) => {

    // console.log(arr)

    return (
        <RootWrap>
            <MapObject arr={arr}/>
        </RootWrap>
    )
}
const RootWrap: FC = ({children}) => {
    return (
        <div className={style.wrap}>
            <span>declare module namespace {' {'}</span>
            <div className={style.rootWrap}>
                {children}
            </div>
            <div>{'}'}</div>
        </div>
    )
}

const MapObject = ({arr}) => {
    return (
        <>
            {arr.map((item) => <Type item={item} key={Math.random()}/>)}
        </>
    )
}

const Type = ({item}) => {

    const [name, type] = item

    const isInterface = typeof type === 'object'

    if (isInterface) return <Interface name={name} types={type}/>
    else if (type.includes('[')) return <ArrayType name={name} type={type}/>
    else return <Primitive name={name} type={type}/>
}

interface InterfaceProps {
    name: string
    types: any[]
}

const Interface: FC<InterfaceProps> = ({name, types}) => {

    const color = colorsObj['interface']

    return (
        <div className={style.wrapInterface}>
            <span className={style.line}>
                <span style={{color}}>{'interface '}</span>
                <span>{name + ' {'}</span>
            </span>
            <div className={style.type}>
                <MapObject arr={types}/>
            </div>
            <div>{'}'}</div>
        </div>
    )

}

interface PrimitiveProps {
    name: string
    type: string
}

const ArrayType: FC<PrimitiveProps> = ({name, type}) => {

    return (
        <div className={style.wrapType}>
            <div className={style.line}>
                <span>{name + ': '}</span>
                <ArrayTypes type={type}/>
            </div>
        </div>
    )
}

const ArrayTypes = ({type}) => {
    const startSlice = type.indexOf('(')
    const endSlice = type.indexOf(')')

    const manyType = type.slice(startSlice + 1, endSlice).split('|').map(item => item.trim())

    const oneType = type.slice(0, type.length - 2)
    const types: string = startSlice !== -1 ? manyType : oneType
    const isArray = Array.isArray(types)

    const colorPrimitive = types in colorsObj ? colorsObj[types] : colorsObj.interface

    return (
        <>
            {isArray ?
                <>
                    <span>{'('}</span>
                    {types.map((item, key) =>
                        <span key={key}>
                            <span style={{color: colorsObj[item]}}>{item}</span>
                            <span>{(key < types.length - 1 ? ' | ' : '')}</span>
                        </span>
                    )
                    }
                    <span>{')'}</span>
                </>
                :
                <span style={{color: colorPrimitive}}>{types}</span>
            }
            <span style={{color: colorsObj['array']}}>{'[]'}</span>
        </>
    )
}

const Primitive: FC<PrimitiveProps> = ({name, type}) => {

    const color = type in colorsObj ? colorsObj[type] : colorsObj.interface

    return (
        <div className={style.wrapType}>
            <div className={style.line}>
                <span>{name + ': '}</span>
                <span style={{color}}>{type}</span>
            </div>
        </div>
    )
}

const colorsObj = {
    interface: '#2f7bd4',
    boolean: '#d65755',
    string: '#cc8248',
    number: '#31c79b',
    array: '#e7b936',
}

