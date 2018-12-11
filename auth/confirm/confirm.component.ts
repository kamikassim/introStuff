import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {


  title:string = "Confirm"
  backLabel:string = "Sign Up"
  logo:string = "./assets/img/logo.png"

  userName:string 
  secret:string

  constructor(private auth:AuthService) { }

  confirm(){
    this.auth.confirm(this.userName, this.secret)  
  }

  back(){
    this.auth.prevSelectedAuthPage('signup')
    window.history.pushState(null, "Sign Up for MyIntro", "/signup")
  }

  ngOnInit() {
    // // // // console.log('confirm page')
    // this.auth.confirm('testuser3', '473945')
  }

}
