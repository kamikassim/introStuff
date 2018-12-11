import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { toBase64String } from '@angular/compiler/src/output/source_map'
import { AuthService } from '../auth/auth.service'
import { AuthUser } from '../classes/auth-user'
import { AlertWindowService } from '../alert-window.service';

@Injectable()
export class ResumeService {

  constructor(private http: HttpClient, private auth: AuthService, private alertwindowservice: AlertWindowService) { }

  user: AuthUser

  private selectedResumeIndex: number = 0


  getUserResumes() {
    let user: AuthUser = new AuthUser(JSON.parse(localStorage.getItem('authSession')).user)
    return user.get('resumes')
  }

  readResume(resume: File) {

    return new Promise((resolve, reject) => {
      let reader = new FileReader()
      reader.readAsDataURL(resume)
      reader.onload = () => {
        let base64:any = reader.result
        let metadata = base64.lastIndexOf(',') + 1
        base64 = base64.substring(metadata)
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

  setResumeIndex(index) {
    this.selectedResumeIndex = index
  }

  nameResume(name: string, aws:AlertWindowService) {
    let newName: string
    newName = name.substring(0, name.lastIndexOf('.'))
    aws.showDataWithoutButton('Uploading<br><br>' + newName)
    return newName
  }

  fileChange(event, aws:AlertWindowService) {
    // // // console.log(JSON.parse(localStorage.getItem('authSession')).user)
    this.user = new AuthUser(JSON.parse(localStorage.getItem('authSession')).user)
    let fileList: FileList = event.target.files
    if (fileList.length > 0) {
      let file: File = fileList[0]

      this.readResume(file).then(
        res => {
          upload(res).then(
            response => {
              this.auth.refreshAuthUser()
              this.auth.$localUser.subscribe(
                (localUser:AuthUser) => {
                  // // // console.log('set next page')
                  aws.setNextPage('/profile/' + localUser.get('username'))
                  aws.showDataWithButton('Upload Successful')
                }
              )
              // // // console.log(response)
            },
            error => {
              aws.showDataWithButton('There was an issue uploading your resume. Please try again later.')
              // // // console.log(error)
            }
          )
        }
      )

      let upload = resume => {
        /** In Angular 5, including the header Content-Type can invalidate your request */
        let url = 'https://t1v62iqgg7.execute-api.us-east-1.amazonaws.com/prod/updateresume'

        let params = {
          uid: this.user.get('uid'),
          authToken: this.user.get('authToken'),
          resumeName: this.nameResume(file.name, aws),
          index: this.selectedResumeIndex,
          base64String: resume
        }

        // // // console.log(params)

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
}
