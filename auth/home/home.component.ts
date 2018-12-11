import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AlertWindowService } from '../../alert-window.service';
declare var FB: any

declare var window: any
@Component({
  selector: 'app-signin-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class AppSigninHomeComponent implements OnInit {
  logo = {
    image: './assets/img/myintro.png',
    alt: 'MyIntro'
  }
  constructor(private router:Router, private auth:AuthService, private alertwindowservice:AlertWindowService) { }

  emailSignin(){
    this.auth.selectAuthPage('email')
    window.history.pushState(null, "Enter Confirmation Code", "/signin/email")
    // this.router.navigateByUrl('signin/email')
  }

  facebookSignin(){
    this.auth.facebookLogin(FB)
  }

  goHome(){
    this.alertwindowservice.showDataWithoutButton('Introduce Yourself')
    setTimeout(() => {
      this.router.navigateByUrl('/')
    }, 2000);
  }

  download(){
    this.alertwindowservice.showDataWithoutButton('Download MyIntro')
    setTimeout(() => {
      this.router.navigateByUrl('download')
    }, 1000);
  }
  
  loadFacebook(){
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    window.fbAsyncInit = function() {
      FB.init({
        appId            : '775129399312429',
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v2.10',
        display          : 'touch',
        status           : true
      })
    }
  }
  ngOnInit() {
    this.loadFacebook()
  }

}
