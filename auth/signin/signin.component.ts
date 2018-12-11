import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class AuthSigninComponent implements OnInit {
  title = 'Sign In';
  backLabel = 'Back';
  logo:string = "./assets/img/logo.png"
  username:string
  password:string

  constructor(private auth:AuthService) { }

  log(message){
    console.log(message)
  }

  login(){
    this.auth.login(this.username, this.password)
  }
  
  forgot(){
    this.auth.selectAuthPage('forgot')
    window.history.pushState(null, "Forgot Password", "/signin/forgot")
  }

  back(){
    this.auth.prevSelectedAuthPage('signin')
    window.history.pushState(null, "Welcome to MyIntro", "/signin")
  }

  create(){
    this.auth.selectAuthPage('signup')
    window.history.pushState(null, "Sign Up for MyIntro", "/signup")
  }

  ngOnInit() {
  }

}
