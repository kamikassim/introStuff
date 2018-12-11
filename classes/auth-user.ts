import { HttpClient } from "@angular/common/http";
import { Resume } from "./resume";

export class AuthUser {

    private avatar: string
    private currentCompany: string
    private displayName: string
    private education: string
    private email: string
    private firstname: string
    private industry: string
    private lastname: string
    private location: string
    private loginStatus: string
    private region: string = 'us-east-1:'
    private title: string
    private uid: string
    private username: string
    private resumes: Array<Resume> = []
    private authToken: string
    private isOnboarded:boolean

    constructor(
        attributes?: Object
    ) {
        this.setAttributes(attributes)
        this.trimAll()
        this.setNames()
        this.setUsername()
        this.setAvatar()
        this.setResumes()
    }

    get(attribute: any) {
        try {
            return this[attribute]
        } catch (e) {
            return null
        }
    }

    private setNames() {
        this.firstname = this.getBegginning(this.displayName)
        this.lastname = this.getEnd(this.displayName)
    }

    replaceResume(position: number, resume: Resume) {
        this.resumes[position] = resume
    }

    setAvatar() {
        let img: string = this['profileThumbnailURL']
        if (img) {
            img = img.trim()
            for (let index = 0; index <= img.length; index++) {
                img = img.replace('\'', '')
            }
        }
        this.avatar = img ? this['profileThumbnailURL'] : 'https://s3.amazonaws.com/myintro-profiles/avatar.jpg'
    }

    getBegginning(str: string) {
        if (str) {
            let replace = str.substring(0, str.indexOf(' '))
            return replace ? replace : str
        } else {
            return str
        }

    }

    getEnd(str: string) {
        if (str) {
            let replace = str.substring(str.lastIndexOf(' '))
            return replace ? replace : str
        } else {
            return str
        }
    }

    set(attribute: any, value: any) {
        try {
            this[attribute] = value
        } catch (e) {
            return false
        }
        return true
    }

    setResumes() {
        let limit = 3
        if (this.resumes)
            if (this.resumes.length < limit) {
                for (let index = 0; index < limit; index++) {
                    if (!this.resumes[index]) {
                        this.resumes[index] = new Resume(null, null, null)
                    }
                }
            }
    }

    private setUsername() {
        try {
            this.username = this.uid.substring(this.uid.indexOf(':') + 1)
        } catch (e) {

        }
    }

    setAttributes(attributes: Object) {
        if (attributes)
            Object.keys(attributes).forEach(key => {
                if(key == 'isOnboarded'){
                    this.isOnboarded = attributes[key] ? attributes[key] : false
                }else{
                    this[key] = attributes[key]
                }
            })
    }

    private trimAll() {
        Object.keys(this).forEach(key => {
            if (typeof (this[key]) == 'string') {
                this[key] = this[key].trim()
            }
        });
    }
}
