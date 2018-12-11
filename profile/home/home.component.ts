import { Component, OnInit } from '@angular/core';
import { ProfileLoaderService } from '../profile-loader.service';
import { AuthUser } from '../../classes/auth-user';

@Component({
  selector: 'app-profile-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class ProfileHomeComponent implements OnInit {

  constructor(private prof: ProfileLoaderService) { }
  user:AuthUser
  resumeURL:string
  userLoggedIn:boolean = false
  load(profUser?){
    if(profUser){
      this.user = profUser
      this.resumeURL = profUser.get('resumeURL') ? profUser.get('resumeURL') : null
      // console.log(this.resumeURL)
      // console.log(profUser.get('resumeURL'))
      // console.log(profUser)
      // console.log('loaded')
    }else{
      this.user = this.prof.user
    }
    
    if(localStorage.getItem('authSession')){
      this.userLoggedIn = true
    }
  }

  openResume(){
    window.open(this.resumeURL, '_blank')
  }

  ngOnInit() {


    this.load()
    // console.log(this.user)

    this.prof.$resumeURL.subscribe (
      url => {
        this.resumeURL = url
      }
    )
    // // // console.log('home active')
    this.prof.$loadComponents.subscribe(
      
      loadComponent => {
        this.load()
        this.resumeURL = this.user.get('resumeURL') ? this.user.get('resumeURL') : null
      }
    )

    this.prof.$profUser.subscribe(
      profUser => {
        this.load(profUser)
      }
    )
  }

}
