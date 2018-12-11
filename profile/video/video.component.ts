import { Component, OnInit } from '@angular/core'
import { ProfileLoaderService } from '../profile-loader.service'
import { AlertWindowService } from '../../alert-window.service'
import { AuthUser } from '../../classes/auth-user'
import * as $ from 'jquery'

@Component({
  selector: 'app-profile-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  user: AuthUser

  play: string = './assets/img/playButton.svg'
  videoUrl: string = 'https://s3.amazonaws.com/myintro-video-output/us-east-1_38632acb-2aed-4eb8-8053-86e7a850582a.mp4'

  isPlayButtonVisible: boolean = true
  showOverlay: boolean = true
  nameSize:number = 4

  videoPlayer: any

  getUserAvatar() {
    return new AuthUser(JSON.parse(localStorage.getItem('authSession')).user).get('avatar')
  }

  setUser() {
    // // // console.log(this.prof.user)
    this.user = new AuthUser(this.prof.user)
    // this.user.name = this.getFirstName(this.prof.user.get('displayName'))
    // this.user.image = this.prof.user.get('avatar')
  }

  getFirstName(name: string) {
    let firstname = name.substring(0, name.indexOf(' '))
    return firstname ? firstname : name
  }

  constructor(private prof: ProfileLoaderService, private alertwindowservice: AlertWindowService) {

  }

  load(profUser?) {
    this.setUser()
    this.videoPlayer = $('#videoPlayer')[0]
    this.user = profUser ? profUser : this.prof.user
    this.videoUrl = this.user.get('videoURL')

    $('#videoPlayer').find('#videoSource').attr('src', this.videoUrl)
    this.videoPlayer.load()

    let userFirstNameLength:number = this.user.get('firstname').length
    let multiplier = 4
    // // console.log(window.innerWidth)
    if(window.innerWidth < 768){
     multiplier = 3
    }
    if( userFirstNameLength > 2){
      // // console.log(userFirstNameLength)
      this.nameSize = multiplier - (0.2 * userFirstNameLength)
      // // console.log(this.nameSize)
    }else{
      this.nameSize = multiplier
    }
    // this.prof.loadComponent('video')
    // // // console.log('load video')
    // if(this.prof.loadComponent('video')){
    // // // // console.log('hide window')
    // this.alertwindowservice.hide()
    // }

    // console.log(this.user.get('videoThumbnailURL'))
  }

  hidePlayButton() {
    if (!this.isPlayButtonVisible) {
      return
    }

    this.isPlayButtonVisible = false

    setTimeout(() => {
      this.showOverlay = false
      this.videoPlayer.play()
    }, 200)
  }

  showPlayButton() {
    this.isPlayButtonVisible = true
    this.showOverlay = true
  }

  ngOnInit() {
    
    this.prof.$profUser.subscribe(
      profUser => {
        this.load(profUser)
      }
    )

    this.prof.$videoOverlayStateSource.subscribe(
      videoOverlayStateSource => {
        this.showOverlay = videoOverlayStateSource
        this.isPlayButtonVisible = this.showOverlay

        if (this.isPlayButtonVisible) {
          this.videoPlayer.pause()
        }
      }
    )

    // this.prof.$loadComponents.subscribe(
    // loadComponents => {
    // // // // console.log('loading video')
    this.load()
    // }
    // )

    // // // console.log('load video')

  }

}
