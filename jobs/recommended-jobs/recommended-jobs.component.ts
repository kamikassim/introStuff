import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { AuthUser } from '../../classes/auth-user';
import { AlertWindowService } from '../../alert-window.service';

@Component({
  selector: 'app-recommended-jobs',
  templateUrl: './recommended-jobs.component.html',
  styleUrls: ['./recommended-jobs.component.scss']
})
export class RecommendedJobsComponent implements OnInit {

  constructor(private router:Router,private http: HttpClient, private auth: AuthService ,private alertwindowservice:AlertWindowService) { }

  user: AuthUser
  jobs = []
  
  getJobs() {
    let url = 'https://t1v62iqgg7.execute-api.us-east-1.amazonaws.com/prod/getjobfeed'
    let params = {
      uid: this.user ? this.user.get('uid') : null,
      authToken: this.user ? this.user.get('authToken') : null
    }
    
    let promise = new Promise((resolve, reject) => {
      this.http.request("POST", url, {
        body: params,
        headers: {
          'Content-Type': 'application/json'
        }
      }).toPromise().then(
        res => {
          resolve(res)
        },
        err => {
          reject(err) 
        }
      )
    })

    return promise
  }

  goto(jobId){
    this.alertwindowservice.showDataWithoutButton('Loading Job')
    setTimeout(() => {
      this.router.navigateByUrl('/jobs/view/' + jobId)
    }, 400);
  }

  ngOnInit() {
    this.user = new AuthUser(this.auth.getUserFromSession()) 
    this.getJobs().then(
      res =>{
        this.jobs = res['body']['jobs']
        this.trimJobDescriptions()
      },
      err =>{
        // console.log(JSON.stringify(err))
      }
  )
  }

  trimJobDescriptions(){
    this.jobs.forEach(job => {
      job['jobDescription'] = job.jobDescription.slice(0,200) + "..."
      job['jobLocation'] = this.setJobLocation(job).jobLocation
    });
  }


  setJobLocation(job){
    var location = {
      string: job['jobLocation'],
      commaCount: job['jobLocation'].split(",").length - 1
    }
    let newJob = job
    newJob.jobLocation = location.commaCount > 1 ? 'Multiple Locations' : location.string;
    return newJob
  }

}
