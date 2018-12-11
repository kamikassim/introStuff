import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { ProfileLoaderService } from './profile/profile-loader.service';
import { AlertWindowService } from './alert-window.service';
import { ImageSizerService } from './image-sizer.service';
import { ResumeService } from './resume/resume.service';
import { AuthUser } from './classes/auth-user';
import { JobService } from './jobs/job.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    AuthService, 
    ProfileLoaderService,
    AlertWindowService,
    ImageSizerService,
    ResumeService,
    JobService
  ]
})
export class AppComponent {
  title = 'MyIntro';


  constructor(private auth:AuthService){
    this.auth.refreshAuthUser()
  }
}
