import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileLoaderService } from './profile-loader.service';
import { AlertWindowComponent } from '../alert-window/alert-window.component';
import { AlertWindowService } from '../alert-window.service';
import { AuthUser } from '../classes/auth-user';
import { AuthService } from '../auth/auth.service';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: AuthUser

  pages = {
    home: false,
    edit: false,
    recruiter: false,
    editVideo: false
  }

  constructor(private location: PlatformLocation, private route: ActivatedRoute,private router:Router, private prof: ProfileLoaderService, private alertwindowservice: AlertWindowService, private auth: AuthService) {
    alertwindowservice.alertActiveState$.subscribe(
      (alertActiveState: boolean) => {
        this.alertActive = alertActiveState
      }
    )

    alertwindowservice.alertVisibleState$.subscribe(
      (alertVisibleState: boolean) => {
        this.alertVisible = alertVisibleState
      }
    )


  }

  alertActive: boolean

  alertVisible: boolean

  setPage() {
    this.pages.edit = this.hasEditParam()
    this.pages.home = !this.hasEditParam()// && !this.hasRecruiterParam()
    this.pages.recruiter = this.hasRecruiterParam()
  }

  hasEditParam() {
    let edit = this.route.routeConfig.path
    let editArray = []
    editArray = edit.split('/')
    try {
      return editArray[2] == 'edit'
    } catch (e) {
      return false
    }
  }

  hasRecruiterParam() {
    let recruiter = this.route.routeConfig.path
    let recruiterList = []
    recruiterList = recruiter.split('/')
    try {
      return recruiterList[2] == 'recruiter'
    } catch (e) {
      return false
    }
  }

  checkForSnapshotParams() {
    let snapshotPage = this.route.snapshot.params.user
    return snapshotPage ? snapshotPage : null
  }

  checkForParams() {
    let page = this.route.routeConfig.path
    if (page.indexOf('/') != -1) {
      page = page.substring(0, page.indexOf('/'))
    }
    return page
  }

  load() {
    this.alertwindowservice.hide()
    this.user = this.prof.user
    this.setPage()
  }

  loadUser(swap?: boolean) {
    this.alertwindowservice.showDataWithoutButton('Loading Profile')
    let run = (swap?: boolean) => {
      let username = this.route.snapshot.params.user

      // // console.log('reached')
      if (!username && this.auth.getUserFromSession()) {
        this.auth.goHome()
      } else if (!!swap) {
        let user = new AuthUser()
        this.prof.getUserPromise(user.get('region') + username).then(
          res => {
            user = new AuthUser(res['body']['Item'])
            this.prof.swapUsers(user, this.alertwindowservice)
          }
        )
      } else {
        // // console.log('reached 2')
        this.prof.getPromiseUserOnInit(username)
          .then(
            res => {
              // // console.log('reached 2')
              this.prof.loadComponents()
            },
            err => {
              // // console.log('reached 2')
              if(!localStorage.getItem('authSession')){
                this.router.navigateByUrl('/signin')
              }else{
                this.router.navigateByUrl('/profile')
              }
            }
          )
      }
    }

    if (!!swap) {
      run(swap)
    } else {
      run()
    }


  }

  ngOnInit() {
    this.prof.$loadComponents.subscribe(
      loadComponent => {
        this.load()
      }
    )

    this.location.onPopState(() => {
      this.loadUser(true)
    })

    this.prof.$profUser.subscribe(
      profUser => {
        this.user = profUser

        // console.log(this.user.get('uid'))
        // console.log(this.user.get('uid').replace('-', ''))
        // // console.log(this.user.get('uid').replace(/[^0-9a-z]/gi, ''))
      }
    )

    this.loadUser()

  }

}
