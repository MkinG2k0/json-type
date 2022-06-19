import {I, T} from "./Constant";


export interface Preset {
    nameI?: boolean
    nameT?: boolean
    types?: boolean
    commas?: boolean
}

export class Parse {
    preset: Preset = {}
    obj = {}
    initStr = ''
    strType = ''

    constructor(preset?: Preset) {
        if (preset) this.preset = preset
    }


    private setType = (object) => {
        const objArr = typeof object === 'object' ? Object.entries(object) : object
        let typeObj = '{\n'
        const Interface: string[] = []

        for (let i = 0; i < objArr.length; i++) {
            const name = objArr[i][0]
            const value = objArr[i][1]

            const isArray = Array.isArray(value)
            const isObject = typeof value === 'object'

            if (value === null) {
                typeObj += this.setNull(name)
            } else if (isArray) {
                typeObj += this.setArray(value, name, Interface)
            } else if (isObject) {
                typeObj += this.setObject(value, name, Interface, typeObj)
            } else {
                typeObj += this.setPrimitive(value, name)
            }
            typeObj += '\n'
        }

        typeObj += `\t}\n`
        typeObj += Interface.join('\n')
        return typeObj
    }

    //Set Valid String Type

    private formatStr = (space, name, separator, type, postFix = ',') =>
        `${space}\t${name}${separator} ${type}${this.preset.commas ? postFix : ''}`

    private validStrInterface = (name, type) => this.formatStr('\n', `${I} ${name}`, '', type)

    private validStrTypes = (name, type) => this.formatStr('\n', `${T} ${name}`, '', type)

    private validStrArray = (name, type) => this.formatStr('\t', name, ':', `${type}[]`)

    private validStrPrimitive = (name, type) => this.formatStr('\t', name, ':', type)

    private validStrObject = (name, type) => this.formatStr('\t', name, ':', type)

    private validStrNull = (name) => this.formatStr('\t', name, ':', 'null')

    // Set Type

    private setArray = (value, name, Interface) => {
        const obj = this.allKeyInObj(value)
        const nextObj = this.setType(obj || {})
        const IName = this.setNameInter(name)
        const arrType = this.allType(value)
        const strType = this.formatStrType(arrType, IName)

        if (obj) Interface.push(`\n${I} ${IName} ${nextObj}`)

        if (this.preset.types && strType.includes('(')) {
            return this.setTypes(name, strType, Interface)
        } else {
            return this.validStrArray(name, strType)
        }
    }

    private setTypes = (name, strType, Interface) => {
        const Name = this.setNameType(name)
        const type = strType.replace('(', '').replace(')', '')

        Interface.push(this.validStrTypes(Name, type))

        return this.validStrArray(name, Name)
    }

    private setNull = (name) => this.validStrNull(name)

    private setObject = (value, name, Interface, typeObj) => {
        const nextObj = this.setType(value)
        const IName = this.setNameInter(name)

        Interface.push(this.validStrInterface(IName, nextObj))

        return this.validStrObject(name, IName)
    }

    private setPrimitive = (value, name) => this.validStrPrimitive(name, typeof value)

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
            // const validStr = this.validObjString(value)
            const obj = JSON.parse(value)
            // console.log(obj)
            this.obj = obj
            // const obj = {"Root": JSON.parse(value)}
            const type = this.setType(obj)
            this.strType = this.wrapInterface(type)
        } catch (e) {
            this.strType = 'error'
        }
    }
}

