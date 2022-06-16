import {I} from "./Constant";

export const setType = (object, initTabs = 1, addI) => {
    const objArr = typeof object === 'object' ? Object.entries(object) : object
    let typeObj = '{\n'
    const Interface: string[] = []
    const spaceStr = '\t'.repeat(Math.max(initTabs, 0))
    const doubleSpaceStr = '\t\t'.repeat(Math.max(initTabs, 0))

    for (let i = 0; i < objArr.length; i++) {
        const name = objArr[i][0]
        const value = objArr[i][1]

        const isArray = Array.isArray(value)
        const isObject = typeof value === 'object'

        if (value === null) {
            typeObj += `${doubleSpaceStr} ${name} : null,`

        } else if (isArray) {
            const obj = allKeyInObj(value)
            const nextObj = setType(obj || {}, 1, addI)
            const IName = setNameInter(name, addI)
            const arrType = allType(value)
            const strType = formatStrType(arrType, IName)

            typeObj += `${spaceStr} ${name}: ${strType}[],`
            if (obj) {
                Interface.push(`\n${spaceStr}${I} ${IName} ${nextObj}`)
            }

        } else if (isObject) {
            const nextObj = setType(value, 1, addI)
            const IName = setNameInter(name, addI)

            typeObj += `${doubleSpaceStr} ${name}: ${IName},`
            Interface.push(`\n${spaceStr}${I} ${IName} ${nextObj}`)

        } else typeObj += `${doubleSpaceStr} ${name}: ${typeof value},`
        typeObj += '\n'
    }

    typeObj += `\t}\n`
    typeObj += Interface.join('\n')
    return typeObj
}


const allType = (arr: any[]) => {
    const resArrType: any[] = []
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        const typeItem = typeof item
        if (!resArrType.includes(typeItem)) {
            resArrType.push(typeItem)
        }
    }
    return resArrType

}

const formatStrType = (arr: any[], nameObj) => {

    const resStrArr = arr.join(' | ').replace('object', nameObj)
    return arr.length > 1 ? `(${resStrArr})` : resStrArr
}

const allKeyInObj = (arr: any[]) => {
    const unique = {}
    let foundObj = false
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        const obj = Object.entries(item)
        if (typeof item === 'object') {
            foundObj = true
            for (let j = 0; j < obj.length; j++) {
                const objItem = obj[j]
                unique[objItem[0]] = objItem[1]
            }
        }
    }
    return foundObj ? unique : undefined
}

export const setNameInter = (name, isNameI) => {
    let IName = name.split('')
    IName[0] = IName[0].toUpperCase()
    return (isNameI ? 'I' : '') + IName.join('')
}

export const validObjString = (value: string) => {
    value = value.replaceAll(' ', '')
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


export const wrapInterface = (str: string) => `declare module namespace { \n \n \t${I} Root ${str}\n}`

export const changeObj = (value, nameI) => {
    try {
        const validStr = validObjString(value)
        const obj = JSON.parse(value)
        // const obj = {"Root": JSON.parse(value)}
        const type = setType(obj, 1, nameI)
        return wrapInterface(type)
    } catch (e) {
        return 'error'
    }
}
declare module namespace {

    interface Root {
        userId: number,
        id: number,
        title: string,
        body: string,
    }

}

