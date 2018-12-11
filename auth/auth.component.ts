import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { AlertWindowService } from '../alert-window.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  page: string
  pages = {
    home: {
      label: 'signin',
      visibility: 'visible',
      active: true,
      zIndex: 1
    },
    signin: {
      label: 'email',
      visibility: 'hidden',
      active: false,
      zIndex: 1
    },
    signup: {
      label: 'signup',
      visibility: 'hidden',
      active: false,
      zIndex: 1
    },
    confirm: {
      label: 'confirm',
      visibility: 'hidden',
      active: false,
      zIndex: 1
    },
    forgot: {
      label: 'forgot',
      visibility: 'hidden',
      active: false,
      zIndex: 1
    },
    remember: {
      label: 'remember',
      visibility: 'hidden',
      active: false,
      zIndex: 1
    },
    logout: {
      label: 'logout',
      visibility: 'hidden',
      active: false,
      zIndex: 1
    }
  }

  alertActive: boolean

  alertVisible: boolean

  constructor(private route: ActivatedRoute, private auth: AuthService, private alertwindowservice: AlertWindowService) {
    this.auth.$selectedPage.subscribe(
      selectedPage => {
        this.nextPage(selectedPage)
      }
    )
    this.auth.$prevSelectedPage.subscribe(
      prevSelectedPage => {
        this.prevPage(prevSelectedPage)
      }
    )
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

  nextPage(page: string) {
    let currentPage = this.getCurrentPage()
    let nextPage = this.getPage(page)

    this.pages[nextPage].zIndex = 3
    this.pages[nextPage].active = true
    setTimeout(() => {
      this.pages[nextPage].visibility = 'visible'
    }, 50)
    setTimeout(() => {
      this.pages[currentPage].visibility = 'hidden'
      this.pages[currentPage].zIndex = 1
      this.pages[currentPage].active = false
      this.pages[nextPage].zIndex = 2
    }, 400)
  }

  prevPage(page: string) {
    let currentPage = this.getCurrentPage()
    let prevPage = this.getPage(page)
    this.pages[prevPage].zIndex = 1
    this.pages[prevPage].active = true
    this.pages[prevPage].visibility = 'visible'
    setTimeout(() => {
      this.pages[currentPage].visibility = 'hidden'
    }, 50)
    setTimeout(() => {
      this.pages[prevPage].zIndex = 2
      this.pages[currentPage].zIndex = 1
      this.pages[currentPage].active = false
    }, 800)
  }

  getCurrentPage() {
    let currentPageLabel = Object.values(this.pages).find(x => {
      return x.label == this.page
    })

    let currentPageIndex = Object.values(this.pages).indexOf(currentPageLabel)

    let currentPage = Object.keys(this.pages)[currentPageIndex]
    return currentPage
  }

  getPage(page) {
    let nextPageLabel = Object.values(this.pages).find(x => {
      return x.label == page
    })
    let nextPageIndex = Object.values(this.pages).indexOf(nextPageLabel)

    let nextPage = Object.keys(this.pages)[nextPageIndex]
    this.page = nextPageLabel.label
    // // // console.log('next page: ' + this.page)
    return nextPage
  }

  setPage() {
    let page = this.checkForParams()
    let snapshotPage = this.checkForSnapshotParams()
    this.page = snapshotPage ? snapshotPage : page

    let currentPage = this.getCurrentPage()

    this.pages[currentPage].zIndex = 2
    this.pages[currentPage].visibility = 'visible'
    this.pages[currentPage].active = true

  }

  checkForSnapshotParams() {
    let snapshotPage = this.route.snapshot.params.page
    return snapshotPage ? snapshotPage : null
  }

  checkUserStatus(){
    if(localStorage.getItem('authSession')){
      this.auth.goHome()
    }
  }

  checkForParams() {
    let page = this.route.routeConfig.path
    if (page.indexOf('/') != -1) {
      page = page.substring(0, page.indexOf('/'))
    }
    return page
  }

  ngOnInit() {
    this.alertwindowservice.showDataWithoutButton('Welcome')
    this.checkUserStatus()
    setTimeout(() => {
      this.alertwindowservice.hide()
    }, 400)
    // // // // console.log(this.route.routeConfig.path)
    this.setPage()

    // this.nextPage('forgot')
    
  }

}
