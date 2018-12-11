import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import { ProfileComponent } from './profile/profile.component';
import { AllJobsComponent } from './jobs/all-jobs/all-jobs.component';
import { JobDetailViewComponent } from './jobs/job-detail-view/job-detail-view.component';
import { DownloadComponent } from './download/download.component';
import { AboutComponent } from './about/about.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { Page404Component } from './page404/page404.component';
import { UpdateResumeComponent } from './resume/update-resume/update-resume.component';
import { EditVideoComponent } from './profile/edit-video/edit-video.component';
import { UnsupportedBrowsersComponent } from './unsupported-browsers/unsupported-browsers.component'

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'hello', component: HomeComponent, pathMatch: 'full' },
  { path: 'signin', component: AuthComponent, pathMatch: 'full' },
  { path: 'signin/:page', component: AuthComponent, pathMatch: 'full' },
  { path: 'signup', component: AuthComponent, pathMatch: 'full' },
  { path: 'signup/:page', component: AuthComponent, pathMatch: 'full' },
  { path: 'logout', component: AuthComponent, pathMatch: 'full' },
  { path: 'about', component: AboutComponent, pathMatch: 'full' },
  { path: 'jobs', component: AllJobsComponent, pathMatch: 'full' },
  { path: 'download', component: DownloadComponent, pathMatch: 'full' },
  { path: 'privacy', component: PrivacyComponent, pathMatch: 'full' },
  { path: 'terms', component: TermsComponent, pathMatch: 'full' },
  { path: 'resume', component: UpdateResumeComponent, pathMatch: 'full' },
  { path: 'unsupportedbrowsers', component: UnsupportedBrowsersComponent },

  { path: 'jobs/view/:id', component: JobDetailViewComponent, pathMatch: 'full' },
  // { path: 'edit/:user', component: ProfileComponent, pathMatch: 'full' },
  
  { path: 'profile/:user/edit', component: ProfileComponent, pathMatch: 'full' },
  { path: 'profile/:user/recruiter/:jobId', component: ProfileComponent, pathMatch: 'full' },
  { path: 'profile/:user', component: ProfileComponent, pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent, pathMatch: 'full' },
  { path: 'profile/:user/editvideo', component: EditVideoComponent, pathMatch: 'full' },


  
  // { path: 'test', component: TestComponent },
  // { path: '**', component: Page404Component },
];

@NgModule({
  imports: [ RouterModule.forRoot(
    routes,
    // {enableTracing: true} // <- debugging only. comment out after
    { 
      // useHash: true,
      // enableTracing: true 
    }
  ) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
