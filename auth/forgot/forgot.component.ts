import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {

  title:string = "Reset"
  backLabel:string = "Sign In"
  logo:string = "./assets/img/logo.png"

  userName:string

  constructor(private auth:AuthService) { }

  back(){
    this.auth.prevSelectedAuthPage('email')
    window.history.pushState(null, "Sign In with Email", "/signin/email")
  }
  forgot(){
    this.auth.forgot(this.userName)
  }

  ngOnInit() {
    // this.userName = 'testuser3'
  }

}
