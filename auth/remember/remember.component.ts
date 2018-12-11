import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-remember',
  templateUrl: './remember.component.html',
  styleUrls: ['./remember.component.scss']
})
export class RememberComponent implements OnInit {

  verification:string
  password:string
  username:string

  title:string = "Reset"
  backLabel:string = "Forgot"
  logo:string = "./assets/img/logo.png"

  constructor(private auth:AuthService) { }

  back(){
    this.auth.prevSelectedAuthPage('forgot')
    window.history.pushState(null, "Forgot password", "/signin/forgot")
  }

  remember(){
    this.auth.remember(this.verification, this.password)
  }

  ngOnInit() {

    this.username = localStorage.getItem('forgottenUser')
    // // // console.log('remember')
    // this.auth.remember()
  }

}
