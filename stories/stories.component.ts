import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileLoaderService } from '../profile/profile-loader.service';
import { AlertWindowService } from '../alert-window.service';
import { AuthUser } from '../classes/auth-user';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import * as $ from 'jquery'

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss']
})

export class StoriesComponent implements OnInit {

  storySize: number
  user: AuthUser
  loggedInUser: AuthUser
  stories = []
  currentXPosition: number = 0

  constructor(private router: ActivatedRoute, private http: HttpClient, private prof: ProfileLoaderService, private alertwindowservice: AlertWindowService, private auth: AuthService) {
  }

  getUsers() {
    let url = 'https://t1v62iqgg7.execute-api.us-east-1.amazonaws.com/prod/users'
    this.loggedInUser = new AuthUser(this.auth.getUserFromSession())
    let params = {
      uid: this.loggedInUser ? this.loggedInUser.get('uid') : null,
      authToken: this.loggedInUser ? this.loggedInUser.get('authToken') : null
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
    return promise
  }

  load() {
    this.user = this.prof.user
    this.prof.loadComponent('stories')
    this.alwaysShow(0)
    this.getUsers().then(
      res => {
        // // console.log(res)
        this.stories = res['body']['users']
      },
      err => {
        // // console.log(JSON.stringify(err))
      }
    )

    setTimeout(() => {
      // this.onInitResize()
    }, 1000)


  }

  scrolling() {
    this.currentXPosition = $('#allStories').scrollLeft()
  }

  move(scrollToRight: boolean) {
    let storyWidth = $('#allStories').width()
    let storiesContainerWidth = $('#storiesContainer').width()
    let distanceFromStart = $('#allStories').scrollLeft()
    if (scrollToRight) {
      if (this.currentXPosition < storiesContainerWidth) {
        $('#allStories').animate(
          {
            scrollLeft: this.currentXPosition + storyWidth
          },
          400
        )
      }
    } else {
      if (this.currentXPosition > 0) {
        $('#allStories').animate(
          {
            scrollLeft: this.currentXPosition - storyWidth
          },
          400
        )
      }
    }
  }

  alwaysShow(count: number) {
    let recurse = () => {
      if (count < 10)
        setTimeout(() => {
          this.alwaysShow(count + 1)
        }, 50)
    }

    try {
      this.onResize(null)
    } catch (e) {
      recurse()
    }

  }

  ngOnInit() {
    // // // // console.log('stories')
    // this.prof.$loadComponents.subscribe(
    // loadComponent => {
    // // // // console.log('stories')
    this.load()
    // }
    // )

  }

  goTo(index) {
    // console.log("clicked")
    let user = new AuthUser(this.stories[index])
    this.prof.swapUsers(user)
    window.history.pushState(null, (user.get('firstname') + '\'s Story'), '/profile/' + user.get('username'))
    this.prof.setOverlay(true)
  }

  getUser(user) {
    this.prof.getUser(user)
  }

  onResize($event) {
    // // // // console.log('loaded')
    // // // console.log('story resize')
    if(document.getElementById('storiesContainer').clientHeight == 0){
      throw 'size is 0'
    }else{
      this.setStorySize(document.getElementById('storiesContainer').clientHeight)
    }
    
  }

  delayedResize($event) {
    setTimeout(() => {
      this.onResize($event)
    }, 50);
  }

  onInitResize() {
    this.onResize(null)
  }

  setStorySize(size: number) {
    this.storySize = size
    console.log('story size changing',size)
  }

}
