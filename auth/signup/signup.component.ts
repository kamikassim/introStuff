import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { AlertWindowService } from '../../alert-window.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  title:string = "Sign Up"
  backLabel:string = "Sign In"
  logo:string = "./assets/img/logo.png"

  displayName:string
  email:string
  userName:string
  password:string
  terms:boolean


  signUp(){
    if(this.terms){
      if(this.password.length < 7){
        this.aws.showDataWithButton('Password must be longer than 6 characters.')
      }else{
        this.auth.signUp(this.displayName, this.userName,this.password,this.email, this.terms)
      }
      
      
    }else{
      // alert('You must agree to the terms in order to signup.')
      this.aws.showDataWithButton('You must agree to the terms in order to signup.')
      
    }
  }

  back(){
    this.auth.prevSelectedAuthPage('email')
    window.history.pushState(null, "Sign In With Email", "/signin/email")
  }

  confirm(){
    this.auth.selectAuthPage('confirm')
    window.history.pushState(null, "Enter Confirmation Code", "/signup/confirm")
  }

  constructor(private auth:AuthService, private aws:AlertWindowService) { }

  ngOnInit() {
    // // // // console.log('singup')
    // this.displayName = 'Test User 3'
    // this.email = 'solo@vetekconsulting.com'
    // this.userName = 'testuser3'
    // this.password = 'Password1'
    // this.terms = true
  }

}
