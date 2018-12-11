import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { logging } from 'protractor';
import { AuthUser } from '../classes/auth-user';
import { AlertWindowService } from '../alert-window.service';

@Injectable()
export class ProfileLoaderService {
  userIdSource = new Subject<string>()
  loadComponentsSource = new Subject<string>()

  $userid = this.userIdSource.asObservable()
  $loadComponents = this.loadComponentsSource.asObservable()

  private profUserSource = new Subject<AuthUser>()
  $profUser = this.profUserSource.asObservable()

  private resumeURLSource = new Subject<string>()
  $resumeURL = this.resumeURLSource.asObservable()

  private videoOverlayStateSource = new Subject<boolean>()
  $videoOverlayStateSource = this.videoOverlayStateSource.asObservable()

  constructor(private http: HttpClient, private auth: AuthService, private route: ActivatedRoute) { }

  user: AuthUser

  loadedComponents = {
    video: false,
    info: false,
    stories: false,
    events: false,
    jobs: false,
    profileData: false,
  }

  componentsLoaded = false

  loadComponent(component) {
    this.loadedComponents[component] = true
    // if(Object.values(this.loadedComponents).find(x =>{
    //   return x == false
    // }) !== false){
    //   this.componentsLoaded = true
    //   this.loadComponents()
    // }
    // return this.componentsLoaded
  }

  // getLoadedComponents(component:string){
  //   return this.loadedComponents[component]
  // }

  // setLoadedComponent(component:string, value:string){
  //   this
  // }

  loadComponents() {
    this.loadComponentsSource.next('true')
    // // // console.log('components loaded')
  }

  setOverlay(shouldShow: boolean) {
      // console.log("here", shouldShow);
      this.videoOverlayStateSource.next(shouldShow)
  }

  swapUsers(user: AuthUser, aws?: AlertWindowService) {
    let loadData = () => {
      this.profUserSource.next(user)
      this.user = (user)
      if (aws) {
        setTimeout(() => {
          aws.hide()
        }, 400)
      }
    }

    if (aws) {
      aws.showDataWithoutButton('Loading Profile')
      setTimeout(() => {
        loadData()
      }, 400)
    } else {
      loadData()
    }

  }


  getUser(uid: string) {
    this.auth.getUser(uid).then(
      res => {
        this.setUser(res, uid)
      }
    )
  }

  getUserPromise(uid: string) {
    return this.auth.getUser(uid)
  }

  setUser(user, uid) {
    user = user.body.Item
    this.user = new AuthUser(new Object({
      avatar: user.profileThumbnailURL,
      currentCompany: user.currentCompany,
      displayName: user.displayName,
      education: user.education,
      industry: user.industry,
      location: user.location,
      title: user.title,
      uid: uid,
    }))
  }

  setLocalUser(user, uid) {
    let newUser: Object = new Object()

    Object.keys(user).map(key => {
      user
      newUser[key] = user[key]
    })

    newUser['uid'] = uid
    this.user = new AuthUser(newUser)
  }

  getUserOnInit(user: string) {
    let loggedInUser: AuthUser = JSON.parse(localStorage.getItem('authSession')).user
    if (user && loggedInUser) {
      if (user == loggedInUser.get('userName')) {
        this.setLocalUser(loggedInUser, loggedInUser.get('region') + loggedInUser.get('username'))
      } else {
        this.getUser(user)
      }
    }
  }

  getPromiseUserOnInit(user) {


    return new Promise((resolve, reject) => {

      try {
        let loggedInUser: AuthUser = new AuthUser(JSON.parse(localStorage.getItem('authSession')).user)
        // // // console.log(loggedInUser)
        // // // console.log('loggedinuser ' + loggedInUser.get('username'))
        if (user && loggedInUser) {

          if (user == loggedInUser.get('username')) {
            // // // console.log('setLoggedIn')

            this.setLocalUser(loggedInUser, loggedInUser.get('region') + loggedInUser.get('username'))
            this.loadUserFromURL(user, resolve, reject)
            resolve()
          } else {
            // // // console.log('getfromurl')
            // // // console.log(user)
            this.loadUserFromURL(user, resolve, reject)
            // resolve()
          }
        }
      } catch (e) {
        this.loadUserFromURL(user, resolve, reject)
      }
    })
  }

  loadUserFromURL(user, resolve, reject) {
    let region = new AuthUser().get('region')
    // // // console.log(region + user)
    this.getUserPromise(region + user).then(
      res => {
        try {
          this.user = new AuthUser(res['body']['Item'])
          this.setResumeURL(this.user.get('resumeURL'))
          resolve(res)
        }catch(e){
          reject(e)
        }
      },
      err => {
        reject(err)
      }
    )
  }

  setResumeURL(resumeURL: string) {
    this.resumeURLSource.next(resumeURL)
  }

}

