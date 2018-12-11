import { Component, OnInit } from '@angular/core'
import * as $ from 'jquery'
import { AuthService } from '../../auth/auth.service'
import { AuthUser } from '../../classes/auth-user'
import { HttpClient } from '@angular/common/http';
import { AlertWindowService } from '../../alert-window.service';

declare var AWS: any

@Component({
    selector: 'app-edit-video',
    templateUrl: './edit-video.component.html',
    styleUrls: ['./edit-video.component.scss']
})
export class EditVideoComponent implements OnInit {
    logo: string = "./assets/img/logo.png"
    uploadIcon: string = ""

    identitypoolid: string = 'us-east-1:5a5c2a67-22e7-436c-8bce-a77322a4d11f'
    inputBucketName: string = 'myintro-video-input'

    user: AuthUser

    thumbnail: boolean = false

    alertActive: boolean

    alertVisible: boolean


    constructor(private auth: AuthService, private http: HttpClient, private alertwindowservice: AlertWindowService) { }

    ngOnInit() {
        this.alertwindowservice.alertActiveState$.subscribe(
            (alertActiveState: boolean) => {
                this.alertActive = alertActiveState
            }
        )

        this.alertwindowservice.alertVisibleState$.subscribe(
            (alertVisibleState: boolean) => {
                this.alertVisible = alertVisibleState
            }
        )

        this.user = this.auth.getUserFromSession()

        this.auth.$localUser.subscribe(
            user => {
                // console.log('user updated')
                this.user = user
            }
        )

        if (this.user.get('isOnboarded') == false || this.user.get('isOnboarded') == 'false') {
            this.toggleOnboardState()
        }

    }

    toggleOnboardState() {
        let url = 'https://t1v62iqgg7.execute-api.us-east-1.amazonaws.com/prod/toggleonboardingstatus'

        let params = {
            uid: this.user.get('uid'),
            authToken: this.user.get('authToken'),
            isOnboarded: true
        }

        let promise = new Promise((resolve, reject) => {
            this.http.request("POST", url, {
                body: params,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).toPromise().then(
                res => {
                    resolve(res)
                },
                err => {
                    reject(err)
                }
            )
        })

        return promise.then(
            res => {

            }, err => {

            }
        )
    }

    signOut() {
        // // // console.log("Sign out")
    }

    triggerUpload() {
        $('#uploadInput').trigger('click')
    }

    setThumbnail(bool: boolean) {
        this.thumbnail = bool
    }

    parseUID(uid: string) {
        return uid.replace(/[^0-9a-z]/gi, '')
    }

    upload(event) {
        let video: any = event.target
        video = video.files[0]

        if (video) {
            // loader()
            var file = video

            let filename: string = file.name
            let nameWithoutExtension = filename.substring(0, filename.lastIndexOf('.'))
            filename = nameWithoutExtension ? this.parseUID(nameWithoutExtension) : this.parseUID(filename)

            let date = new Date().getTime() / 1000 | 0
            filename = this.parseUID(this.user.get('uid')) + filename + date

            let username = this.user.get('username')

            let params = {
                Bucket: this.inputBucketName,
                Key: filename,
                Body: file,
                ContentType: file.type
            }

            // console.log('params', params)
            switch (video.type) {
                case 'video/mp4':
                case 'video/quicktime':
                case 'video/avi':
                    AWS.config.region = 'us-east-1'

                    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                        IdentityPoolId: "us-east-1:5a5c2a67-22e7-436c-8bce-a77322a4d11f"
                    })

                    let uploadVideoToProfile = (videoName) => {
                        return this.uploadVideoToProfile(videoName)
                    }

                    let aws = this.alertwindowservice

                    let auth = this.auth
                    aws.showDataWithoutButton('Uploading Video. Please wait...')
                    let setThumbnail = (bool: boolean) => {
                        this.setThumbnail(bool)
                    }
                    AWS.config.credentials.get((err, data) => {
                        if (err) aws.showDataWithButton('An error has occurred. Please try again later.')
                        var s3 = new AWS.S3()
                        // // console.log(data)
                        s3.upload(params, function (err, data) {
                            if (err) {
                                // console.log(err)
                                //   return alert('There was an error uploading your video: ', err.message)
                                aws.showDataWithButton('An error has occurred. Please try again later.')
                            } else {
                                // console.log('video uploaded successfully')
                                aws.showDataWithoutButton('Upload Successful! Saving... Please wait.')
                                uploadVideoToProfile(filename).then(
                                    res => {
                                        auth.refreshAuthUser()
                                        aws.showDataWithButton('Your video is processing. It may be a few moments before it is ready. Go ahead and upload a thumnail for your video so that it stands out.')
                                        setTimeout(() => {
                                            setThumbnail(true)
                                        }, 400);
                                        // console.log('res', res)
                                    },
                                    err => {
                                        aws.showDataWithButton('An error has occurred. Please try again later.')
                                        // console.log('err', err)
                                    }
                                )
                            }

                        })
                    })

                    break
                default:
                    // loader()
                    alert('Invalid file type. Only files ending with .mov, .mp4, or .avi are accepted. Please try again.')
                    break
            }

        }
        // let params = {
        //     Bucket: this.inputBucketName,
        //     Key: ,
        //     Body: ,
        //     ContentType: ,
        // }

        // Stopped here
    }


    readImage(image) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader()
            reader.readAsDataURL(image)
            reader.onload = () => {
                let base64 = reader.result
                resolve(base64)
            },
                reader.onerror = () => {
                    reject('An error occurred.')
                }
            reader.onabort = () => {
                reject('Upload Canceled')
            }
        })
    }

    thumbnailUpload(event) {
        // // // console.log(JSON.parse(localStorage.getItem('authSession')).user)
        this.user = new AuthUser(JSON.parse(localStorage.getItem('authSession')).user)
        let fileList: FileList = event.target.files
        if (fileList.length > 0) {
            let file: File = fileList[0]

            this.readImage(file).then(
                res => {
                    upload(res).then(
                        response => {
                            let code = Math.floor(Math.random() * 100) + 1;
                            this.auth.refreshAuthUser(code)
                            this.auth.$localUser.subscribe(
                                (localUser: AuthUser) => {
                                    if (this.auth.refreshCodes[code] && this.auth.refreshCodes[code]['inUse'] == true) {
                                        this.alertwindowservice.setNextPage('/profile/' + localUser.get('username'))
                                        this.alertwindowservice.showDataWithButton('Upload Successful. Your video may still be processing.')
                                        delete this.auth.refreshCodes[code]
                                    }
                                }
                            )
                        },
                        error => {
                            this.alertwindowservice.showDataWithButton('There was an issue uploading your image. Your file may be too large. Try a smaller image.')
                        }
                    )
                }
            )

            let upload = (image) => {
                let url = 'https://t1v62iqgg7.execute-api.us-east-1.amazonaws.com/prod/users/updatevideothumbnail'
                image = image.substring(image.lastIndexOf(','))
                let params = {
                    uid: this.user.get('uid'),
                    authToken: this.user.get('authToken'),
                    base64String: image,
                    fileName: this.user.get('username')
                }

                let promise = new Promise((resolve, reject) => {
                    this.http.request("POST", url, {
                        body: params,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Accept': 'application/json'
                        }
                    }).toPromise().then(
                        res => {
                            resolve(res)
                        },
                        err => {
                            reject(err)
                        }
                    )
                })

                return promise
            }

        }
    }

    uploadVideoToProfile(videoName) {
        let url = 'https://t1v62iqgg7.execute-api.us-east-1.amazonaws.com/prod/validatevideoupload'
        let params = {
            uid: this.user.get('uid'),
            authToken: this.user.get('authToken'),
            name: videoName + '.mp4'
        }

        // // // console.log(params)

        let promise = new Promise((resolve, reject) => {
            this.http.request("POST", url, {
                body: params,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).toPromise().then(
                res => {
                    // // // console.log(res)
                    resolve(res)
                },
                err => {
                    // // // console.log(err)
                    reject(err)
                }
            )
        })
        return promise
    }

    skip() {
        // // // console.log("Skip")
        this.auth.goHome()
    }

    tips() {
        window.location.href = "/about"
        // // // console.log("tip!")
    }
}