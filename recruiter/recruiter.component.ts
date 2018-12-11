import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthUser } from '../classes/auth-user';
import { ProfileLoaderService } from '../profile/profile-loader.service';

@Component({
  selector: 'app-recruiter',
  templateUrl: './recruiter.component.html',
  styleUrls: ['./recruiter.component.scss']
})
export class RecruiterComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient, private prof:ProfileLoaderService) { }


  logJob() {
    // // console.log(this.route)

    let url = 'https://t1v62iqgg7.execute-api.us-east-1.amazonaws.com/prod/logjobapplication'
    let user:AuthUser = new AuthUser()
    let params = {
      uid: user.get('region') + this.route.snapshot.params['user'],
      jobId: this.route.snapshot.params['jobId']
    }

    // // console.log(params)
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

  ngOnInit() {
    this.logJob().then(
      res => {
        if(res['body']['resumeURL'])
        this.prof.setResumeURL(res['body']['resumeURL'])
      },
      err => {
        // // console.log(err)
      }
    )
  }

}
