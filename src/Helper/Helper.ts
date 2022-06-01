import {I} from "./Constant";

export const setType = (objArr, initTabs = 1, addI = false) => {
    let typeObj = '{\n'
    const Interface: string[] = []
    const spaceStr = ' '.repeat(Math.max(initTabs, 0))

    for (let i = 0; i < objArr.length; i++) {
        const name = objArr[i][0]
        const value = objArr[i][1]

        if (value === null) {
            typeObj += `${spaceStr} ${name} : null,`
        } else if (typeof value === 'object') {
            const nextObj = setType(Object.entries(value), 1, addI)
            const IName = setNameInter(name, addI)

            typeObj += `${spaceStr} ${name} : ${IName},`
            Interface.push(`\n${spaceStr}${I} ${IName} ${nextObj}`)

        } else typeObj += `${spaceStr} ${name} : ${typeof value},`
        typeObj += '\n'
    }

    typeObj += `${spaceStr}}\n`
    typeObj += Interface.join('\n')
    return typeObj
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


export const wrapInterface = (str: string) => `declare module namespace { \n ${I} Root ${str}}`

export const changeObj = (value, nameI) => {
    let res = ''
    try {
        const validStr = validObjString(value)
        const obj = JSON.parse(validStr)
        const type = setType(Object.entries(obj), 1, nameI)
        res = wrapInterface(type)
    } catch (e) {
        res = 'error'
    }
    return res
}