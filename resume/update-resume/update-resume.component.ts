import { Component, OnInit } from '@angular/core';
import { ResumeService } from '../resume.service';
import { Resume } from '../../classes/resume';
import { AuthService } from '../../auth/auth.service';
import { AlertWindowService } from '../../alert-window.service';

@Component({
  selector: 'app-update-resume',
  templateUrl: './update-resume.component.html',
  styleUrls: ['./update-resume.component.scss']
})
export class UpdateResumeComponent implements OnInit {

  constructor(private resumeService:ResumeService, private auth: AuthService, private alertwindowservice:AlertWindowService) { 
    alertwindowservice.alertActiveState$.subscribe(
      (alertActiveState: boolean) => {
        this.alertActive = alertActiveState
      }
    )

    alertwindowservice.alertVisibleState$.subscribe(
      (alertVisibleState: boolean) => {
        this.alertVisible = alertVisibleState
      }
    )
  }

  alertActive: boolean

  alertVisible: boolean


  resumes:Array<Resume> //= [null, null, null]

  fileChange(event, index){
    // // // console.log(index)
    this.resumeService.setResumeIndex(index)
    this.resumeService.fileChange(event, this.alertwindowservice)
  }

  cancel(){
    this.auth.goHome()
  }



  ngOnInit() {
    this.auth.$localUser.subscribe(
      localUser => {
        // // console.log(localUser)
        this.resumes = this.resumeService.getUserResumes()
      }
    )


    // // console.log(this.resumeService.getUserResumes())
    this.resumes = this.resumeService.getUserResumes()
    // // console.log(this.resumes)
  }

}
