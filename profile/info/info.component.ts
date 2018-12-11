import { Component, OnInit } from '@angular/core';
import { ProfileLoaderService } from '../profile-loader.service';
import { AlertWindowService } from '../../alert-window.service';
import { AuthUser } from '../../classes/auth-user';

@Component({
  selector: 'app-profile-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  user:AuthUser
  resumeURL:string
  imageSize
  constructor(private prof: ProfileLoaderService, private alertwindowservice: AlertWindowService) {
    // prof.$loadComponents.subscribe(
    //   loadComponent => {
    //     this.load()
    //   }
    // )
  }

  imageRefreshCount: number = 0

  onResize($event) {
    this.resizeImage()
  }

  resizeImage() {
    let imageContainers = document.getElementsByClassName('userAvatarContainer')
    let imageHeight = []

    for (let index = 0; index < imageContainers.length; index++) {
      imageHeight[index] = imageContainers[index].clientHeight
      // // // // console.log(imageHeight[index])
    }
    // // // console.log(imageHeight)
    imageHeight.sort((a, b) => {
      return b - a
    })

    if (imageHeight.length == 0) {
      // this.alwaysShow()
    } else {
      this.setImageSize(imageHeight[0])
    }


  }

  delayedResize($event) {
    setTimeout(() => {
      this.onResize($event)
    }, 50);
  }

  onInitResize() {
    this.resizeImage()
  }
  setImageSize(size: number) {
    this.imageSize = size
  }

  alwaysShow() {
    // // // console.log('alwasy show')
    let recurse = () => {
      if (this.imageRefreshCount < 10)
        this.imageRefreshCount++
      setTimeout(() => {
        this.resizeImage()
      }, 50)
    }

    recurse()

  }

  load() {
    // console.log('loaded')

    this.user = this.prof.user
    console.log('user', this.user)
    this.prof.loadComponent('info')
    this.resumeURL = this.user.get('resumeURL') ? this.user.get('resumeURL') : null
    console.log('resumeurl',this.resumeURL)

    // this.alwaysShow()
    
  }
  openResume(){
    window.open(this.resumeURL, '_blank')
  }

  setResumeURL(){
    this.resumeURL = this.user.get('resumeURL') ? this.user.get('resumeURL') : null
    // console.log('resumeurl',this.resumeURL)
  }

  ngOnInit() {
    this.prof.$profUser.subscribe(
      profUser =>{
        this.user = profUser
        this.setResumeURL()
      }
    )
    // console.log(this.user)
    this.load()
  }

}
