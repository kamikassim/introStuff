import { Component, OnInit } from '@angular/core';
import { AlertWindowService } from '../../alert-window.service';
import { ProfileInput } from '../../classes/profile-input';
import { AuthUser } from '../../classes/auth-user';
import { ProfileLoaderService } from '../profile-loader.service';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProfileDropdown } from '../../classes/profile-dropdown';
import { formControlBinding } from '@angular/forms/src/directives/ng_model';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  user: AuthUser

  formControlBinding 

  inputs: Array<ProfileInput> = [
    new ProfileInput({
      name: 'displayName',
      placeholder: 'Full Name'
    }),
    new ProfileInput({
      name: 'title',
      placeholder: 'Title'
    }),
    new ProfileInput({
      name: 'location',
      placeholder: 'Location'
    }),
    new ProfileInput({
      name: 'industry',
      placeholder: 'Major / Industry'
    }),
    new ProfileInput({
      name: 'institution',
      placeholder: 'Institution'
    }),
    new ProfileInput({
      name: 'educationlevel',
      placeholder: 'Education Level'
    }),
    new ProfileInput({
      name: 'yearsofexperience',
      placeholder: 'Years of Experience'
    }),
    new ProfileInput({
      name: 'companyinterest',
      placeholder: 'Company Interest'
    }),
    new ProfileInput({
      name: 'areyouwillingtorelocate',
      placeholder: 'Are you willing to relocate?'
    }),
    new ProfileInput({
      name: 'workauthorization',
      placeholder: 'Are you authorized to work in the U.S?'
    }),
    new ProfileInput({
      name: 'positions',
      placeholder: "I'm interested in the following positions."
    }),
    new ProfileInput({
      name: 'skills',
      placeholder: 'What are your skills?'
    }),
    new ProfileInput({
      name: 'gender',
      placeholder: 'Select your gender.'
    }),
    new ProfileInput({
      name: 'ethnicity',
      placeholder: 'What is your ethnicity?'
    }),
    // new ProfileInput({
    //   name: 'description',
    //   placeholder: 'Profile Description'
    // }),
    // new ProfileInput({
    //   name: 'website',
    //   placeholder: 'Website URL'
    // }),
  ]

  textareas = [
    {
      label: 'Profile Description',
      name: 'description',
      value: ''
    }
  ]



  // workauthorization = ["yes", "no"];
  // gender = ["female", "male", "I prefer to not disclose"];

  editVideo(){
    this.router.navigateByUrl('/profile/' + this.user.get('username') + '/editvideo')
  }

  cancel() {
    this.router.navigateByUrl('/profile/' + this.user.get('username'))
    // window.history.back()
  }

  submit() {
    let params = {}
    this.inputs.map(input => {
      // if(!!input.get('value')){
        // console.log(input.get('name'))
        var data = input.get('value')
        params[input.get('name')] = data ? data : ' '
      // }
    })

    this.textareas.map(text => {
      // if(!!text.value){
        params[text.name] = text.value ? text.value : ' '
      // }
    })
    this.alertwindowservice.showDataWithoutButton('Updating your profile')
    this.auth.updateUser(this.user.get('uid'), this.user.get('authToken'), params).then(
      res => {
        this.auth.refreshAuthUser()
        this.alertwindowservice.setNextPage('/profile/' + this.user.get('username'))
        this.alertwindowservice.showDataWithButton('Profile updated successfully.')
        
        // console.log(res)
      },
      err => {
        // console.log(err)
      }
    )
  }

  uploadResume() {
    this.router.navigateByUrl('resume')
  }

  logout() {
    this.auth.logout()
  }

  setValues() {
    this.inputs.map(input => {
      let value:string = this.user.get(input.get('name'))
      if(value){
        console.log(value)
        input.set('value', value.trim())
      }
    })
    let description:string = this.user.get('description')
    this.textareas[0].value = description ? description.trim() : null
  }

  load() {
    this.user = this.auth.getUserFromSession()
    this.setValues()
    this.alertwindowservice.hide()
  }

  readImage(image) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.readAsDataURL(image)

        reader.onload = () => {
            let base64 = reader.result
            // let metadata = base64.lastIndexOf(',') + 1
            // base64 = base64.substring(metadata)
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
        console.log(this.readImage(file))

        this.readImage(file).then(
            res => {
                upload(res).then(
                    response => {
                        console.log("Response after upload")
                        // this.alertwindowservice.showDataWithButton('Upload Successful. Your image may still be processing.')
                        //REFRESH VIEW
                        let code = Math.floor(Math.random() * 100) + 1;
                        this.auth.refreshAuthUser(code)
                        this.auth.$localUser.subscribe(
                            (localUser: AuthUser) => {
                              if(this.auth.refreshCodes[code] && this.auth.refreshCodes[code]['inUse'] == true){
                                this.alertwindowservice.setNextPage('/profile/' + localUser.get('username'))
                                this.alertwindowservice.showDataWithButton('Upload Successful. Your image may still be processing.')
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
          console.log("Uploading")
            let url = 'https://t1v62iqgg7.execute-api.us-east-1.amazonaws.com/prod/users/updatevideoprofilethumbnailurl'
            image = image.substring(image.lastIndexOf(','))
            let params = {
                uid: this.user.get('uid'),
                authToken: this.user.get('authToken'),
                base64String: image,
                fileName: this.user.get('username')
            }
            console.log(this.user.get('uid'))

            let promise = new Promise((resolve, reject) => {
                this.http.request("POST", url, {
                    body: params,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                    }
                }).toPromise().then(
                    res => {
                        console.log("We got a response")
                        resolve(res)
                    },
                    err => {
                      console.log("Error")
                        reject(err)
                    }
                )
            })

            return promise
        }

    }
}
clickInput(){
  document.getElementById("hiddenInput").click()
}
  constructor(private http: HttpClient, private router: Router, private auth: AuthService, private prof: ProfileLoaderService, private alertwindowservice: AlertWindowService) { }

  ngOnInit() {
    this.load()

  }

}
