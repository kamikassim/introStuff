import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './/app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthComponent } from './auth/auth.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AppSigninHomeComponent } from './auth/home/home.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { RememberComponent } from './auth/remember/remember.component';
import { AuthSigninComponent } from './auth/signin/signin.component';
import { ConfirmComponent } from './auth/confirm/confirm.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { ProfileComponent } from './profile/profile.component';
import { EditComponent } from './profile/edit/edit.component';
import { ProfileHomeComponent } from './profile/home/home.component';
import { NavComponent } from './nav/nav.component';
import { NavSearchComponent } from './nav/nav-search/nav-search.component';
import { StoriesComponent } from './stories/stories.component';
import { InfoComponent } from './profile/info/info.component';
import { VideoComponent } from './profile/video/video.component';
import { JobsComponent } from './jobs/jobs.component';
import { EventsComponent } from './events/events.component';
import { InitDirective } from './init.directive';
import { AlertWindowComponent } from './alert-window/alert-window.component';
import { AllJobsComponent } from './jobs/all-jobs/all-jobs.component';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';
import { NavOldComponent } from './nav/nav-old/nav-old.component';
import { JobDetailViewComponent } from './jobs/job-detail-view/job-detail-view.component';
import { FacebookComponent } from './auth/facebook/facebook.component';
import { DownloadComponent } from './download/download.component';
import { HomeNavComponent } from './nav/home-nav/home-nav.component';
import { AboutComponent } from './about/about.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { Page404Component } from './page404/page404.component';
import { ApplyComponent } from './jobs/apply/apply.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { ResumeComponent } from './resume/resume.component';
import { UpdateResumeComponent } from './resume/update-resume/update-resume.component';
import { EditVideoComponent } from './profile/edit-video/edit-video.component';
import { HistoryComponent } from './jobs/history/history.component';
import { RecruiterComponent } from './recruiter/recruiter.component';
import { RecommendedJobsComponent } from './jobs/recommended-jobs/recommended-jobs.component';
import { EditVideoThumbnailComponent } from './profile/edit-video-thumbnail/edit-video-thumbnail.component';
import { UnsupportedBrowsersComponent } from './unsupported-browsers/unsupported-browsers.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthComponent,
    SignupComponent,
    ForgotComponent,
    RememberComponent,
    AuthSigninComponent,
    AppSigninHomeComponent,
    ConfirmComponent,
    LogoutComponent,
    ProfileComponent,
    EditComponent,
    ProfileHomeComponent,
    NavComponent,
    NavSearchComponent,
    StoriesComponent,
    InfoComponent,
    VideoComponent,
    JobsComponent,
    EventsComponent,
    InitDirective,
    AlertWindowComponent,
    AllJobsComponent,
    BottomNavComponent,
    NavOldComponent,
    JobDetailViewComponent,
    FacebookComponent,
    DownloadComponent,
    HomeNavComponent,
    AboutComponent,
    PrivacyComponent,
    TermsComponent,
    Page404Component,
    ApplyComponent,
    EditProfileComponent,
    ResumeComponent,
    UpdateResumeComponent,
    EditVideoComponent,
    HistoryComponent,
    RecruiterComponent,
    RecommendedJobsComponent,
    EditVideoThumbnailComponent,
    UnsupportedBrowsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
