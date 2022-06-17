import {I, T} from "./Constant";


export interface Preset {
    nameI?: boolean
    nameT?: boolean
    types?: boolean
    commas?: boolean
}

export class Parse {
    preset: Preset = {}
    initStr = ''
    strType = ''

    constructor(preset?: Preset) {
        if (preset) this.preset = preset
    }


    private setType = (object, initTabs = 1) => {
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
                typeObj += this.setNull(spaceStr, name)
            } else if (isArray) {
                typeObj += this.setArray(value, name, Interface, spaceStr)
            } else if (isObject) {
                typeObj += this.setObject(value, name, Interface, spaceStr, typeObj, doubleSpaceStr)
            } else {
                typeObj += this.setPrimitive(value, name, doubleSpaceStr)
            }
            typeObj += '\n'
        }

        typeObj += `\t}\n`
        typeObj += Interface.join('\n')
        return typeObj
    }

    // Set Type

    private setArray = (value, name, Interface, spaceStr) => {
        const obj = this.allKeyInObj(value)
        const nextObj = this.setType(obj || {})
        const IName = this.setNameInter(name)
        const arrType = this.allType(value)
        const strType = this.formatStrType(arrType, IName)

        if (obj) {
            Interface.push(`\n${spaceStr}${I} ${IName} ${nextObj}`)
        }

        if (this.preset.types) {
            return this.setTypes(spaceStr, name, strType, Interface)
        } else {
            return `${spaceStr} ${name}: ${strType}[],`
        }
    }

    private setTypes = (spaceStr, name, strType, Interface) => {
        const Name = this.setNameType(name)
        const validType = strType.replace('(', '').replace(')', '')

        Interface.push(`\n${spaceStr}${T} ${Name} = ${validType}`)

        return `\t${spaceStr} ${name}: ${Name}[],`
    }

    private setNull = (doubleSpaceStr, name) => `${doubleSpaceStr} ${name} : null,`

    private setObject = (value, name, Interface, spaceStr, typeObj, doubleSpaceStr) => {
        const nextObj = this.setType(value)
        const IName = this.setNameInter(name)

        Interface.push(`\n${spaceStr}${I} ${IName} ${nextObj}`)
        return `${doubleSpaceStr} ${name}: ${IName},`
    }

    private setPrimitive = (value, name, doubleSpaceStr) => `${doubleSpaceStr} ${name}: ${typeof value},`

    // Add Prefix

    private toUpperFirstChar = (str: string) => {
        let IName = str.split('')
        IName[0] = IName[0].toUpperCase()
        return IName.join('')
    }

    private toggleName = (name: string, toggle: boolean | undefined, addChar: string) => {
        if (toggle) return this.toUpperFirstChar(addChar + this.toUpperFirstChar(name))
        else return this.toUpperFirstChar(name)
    }

    private setNameInter = (name) => this.toggleName(name, this.preset.nameI, 'I')

    private setNameType = (name) => this.toggleName(name, this.preset.nameT, 'T')

    // Add Prefix

    private allType = (arr: any[]) => {
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

    private formatStrType = (arr: any[], nameObj) => {
        const resStrArr = arr.join(' | ').replace('object', nameObj)
        return arr.length > 1 ? `(${resStrArr})` : resStrArr
    }

    private allKeyInObj = (arr: any[]) => {
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

    private validObjString = (value: string) => {
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

    private wrapInterface = (str: string) => `declare module namespace { \n \n \t${I} Root ${str}\n}`

    public update = () => {
        this.setStr(this.initStr)
    }

    public setStr = (value: string) => {
        try {
            this.initStr = value
            // console.log(this.initStr)
            // console.log(value)
            // const validStr = this.validObjString(value)
            const obj = JSON.parse(value)
            // const obj = {"Root": JSON.parse(value)}
            const type = this.setType(obj)
            this.strType = this.wrapInterface(type)
        } catch (e) {
            this.strType = 'error'
        }
    }
}