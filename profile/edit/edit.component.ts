import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  constructor(private auth:AuthService) { }

  logout(){
    this.auth.logout()
  }

  ngOnInit() {
    this.logout()
  }

}
