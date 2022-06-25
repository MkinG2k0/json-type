import {I, T} from "./Constant";

export interface Preset {
    nameI?: boolean
    nameT?: boolean
    types?: boolean
    commas?: boolean
}

type typeValue = 'null' | 'array' | 'object' | 'primitive'


export class Parse {
    outArrType: any[] = []
    inArrType: any[] = []
    preset: Preset = {}
    obj = {}
    initStr = ''
    strType = ''

    private lineType: string[] = []

    constructor(preset?: Preset) {
        if (preset) this.preset = preset
    }

    public setType = (name, value) => {

        const type = this.getType(value)

        if (type === 'null') return this.setNull(name)
        else if (type === 'array') return this.setArray(name, value)
        else if (type === 'object') return this.setObject(name, value)
        else if (type === 'primitive') return this.setPrimitive(name, value)
        else return 'error'
    }

    public getType = (value): typeValue => {
        const isArray = Array.isArray(value)
        const isObject = typeof value === 'object'
        const isNull = value === null

        if (isNull) return 'null'
        else if (isArray) return 'array'
        else if (isObject) return 'object'
        else return 'primitive'
    }

    private setTypeToStr = (object) => {
        const objArr = typeof object === 'object' ? Object.entries(object) : object
        let typeObj = ''

        for (let i = 0; i < objArr.length; i++) {
            const name = objArr[i][0]
            const value = objArr[i][1]

            typeObj += this.setType(name, value)

            typeObj += '\n'
        }

        typeObj = `{\n${typeObj}\t}\n`
        typeObj += this.lineType.join('\n')
        this.lineType = []

        return typeObj
    }

    //

    private toArray = (obj, arr) => {
        return [['Root', this.toArrayType(obj, arr)], ...arr]
    }

    private toArrayType = (obj: object, gArr: any[]) => {
        const arr: any[] = []

        for (const [name, type] of Object.entries(obj)) {
            const typeStr = this.setType(name, type).split(':')[1].trim() // ?
            const getType = this.getType(type)

            if ((getType === 'object')) {
                const nameI = this.setNameInter(name)
                arr.push([name, nameI])

                gArr.unshift([nameI, this.toArrayType(type, gArr)])
            }
                // else if (getType === '') {
            // }
            else {
                arr.push([name, typeStr])
            }
        }

        return arr
    }

    //Set Valid String Type

    private formatStr = (space, name, separator, type, postFix = ';') =>
        `${space}\t${name}${separator} ${type}${this.preset.commas ? postFix : ''}`

    private validStrInterface = (name, type) => this.formatStr('\n', `${I} ${name}`, '', type, '')

    private validStrTypes = (name, type) => this.formatStr('', `${T} ${name}`, ' =', type)

    private validStrArray = (name, type) => this.formatStr('\t', name, ':', `${type}[]`)

    private validStrPrimitive = (name, type) => this.formatStr('\t', name, ':', type)

    private validStrObject = (name, type) => this.formatStr('\t', name, ':', type)

    private validStrNull = (name) => this.formatStr('\t', name, ':', 'null')

    // Set Type

    private setArray = (name, value) => {
        const obj = this.allKeyInObj(value)
        const nextObj = this.setTypeToStr(obj || {})
        const IName = this.setNameInter(name)
        const arrType = this.allType(value)
        const strType = this.formatStrType(arrType, IName)

        if (obj) this.lineType.push(this.validStrInterface(IName, nextObj))

        if (this.preset.types && strType.includes('(')) {
            return this.setTypes(name, strType)
        } else {
            return this.validStrArray(name, strType)
        }
    }

    private setTypes = (name, strType) => {
        const Name = this.setNameType(name)
        const type = strType.replace('(', '').replace(')', '')

        this.lineType.push(this.validStrTypes(Name, type) + '\n') // ugly

        return this.validStrArray(name, Name)
    }

    private setNull = (name) => this.validStrNull(name)

    private setObject = (name, value) => {
        const nextObj = this.setTypeToStr(value)
        const IName = this.setNameInter(name)

        this.lineType.push(this.validStrInterface(IName, nextObj))

        return this.validStrObject(name, IName)
    }

    private setPrimitive = (name, value) => this.validStrPrimitive(name, typeof value)

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

    private wrapInterface = (str: string) => `declare module namespace {\n\n\t${I} Root ${str}\n}`

    public update = () => {
        this.setStr(this.initStr)
    }

    public setStr = (value: string) => {
        try {
            this.initStr = value
            // const validStr = this.validObjString(value)
            const obj = JSON.parse(value)
            this.inArrType = this.toArray(obj, this.inArrType)
            // console.log(obj)
            this.obj = obj
            // const obj = {"Root": JSON.parse(value)}
            const type = this.setTypeToStr(obj)
            this.outArrType = this.toArray(obj, this.outArrType)

            this.strType = this.wrapInterface(type)
        } catch (e) {
            this.strType = 'error'
        }
    }
}
