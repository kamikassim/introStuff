export class ProfileInput {
    private classes: Array<string>
    private label:string
    private name: string
    private placeholder: string
    private type: string
    private value: string

    constructor(attributes?: Object, type?: string) {
        this.type = type ? type : 'text'
        this.setAttributes(attributes)
        this.trimAll()
    }

    setAttributes(attributes: Object) {
        Object.keys(attributes).forEach(key => {
            this[key] = attributes[key]
        })
    }

    get(attribute: any) {
        try {
            return this[attribute]
        } catch (e) {
            return null
        }
    }

    getBegginning(str: string) {
        return str ? str.substring(0, str.indexOf(' ')) : null
    }

    getEnd(str: string) {
        return str ? str.substring(str.lastIndexOf(' ')) : null
    }

    set(attribute: any, value: any) {
        try {
            this[attribute] = value
        } catch (e) {
            return false
        }
        return true
    }
    private trimAll() {
        Object.keys(this).forEach(key => {
            if (typeof (this[key]) == 'string') {
                this[key] = this[key].trim()
            }
        });
    }


}
