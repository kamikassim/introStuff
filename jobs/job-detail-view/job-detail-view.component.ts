import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { AlertWindowService } from '../../alert-window.service';
import { AuthService } from '../../auth/auth.service';
import { ImageSizerService } from '../../image-sizer.service';
import { AuthUser } from '../../classes/auth-user';
import { JobService } from '../job.service';

@Component({
  selector: 'app-job-detail-view',
  templateUrl: './job-detail-view.component.html',
  styleUrls: ['./job-detail-view.component.scss']
})
export class JobDetailViewComponent implements OnInit {

  alertActive: boolean

  alertVisible: boolean
  user: AuthUser
  siteVisible: boolean = false
  events = null
  constructor(private http: HttpClient, private route: ActivatedRoute, private alertwindowservice: AlertWindowService, private auth: AuthService, private imageTrigger: ImageSizerService, private jobservice:JobService) {



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

  job

  getJob() {
    let url = 'https://t1v62iqgg7.execute-api.us-east-1.amazonaws.com/prod/getjobbyid'
    let id = this.route.snapshot.params.id
    let params = {
      id: id,
      uid: this.user ? this.user.get('uid') : null,
      authToken: this.user ? this.user.get('authToken') : null
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
          // // console.log(res)
          resolve(res)
        },
        err => {
          reject(err)
        }
      )
    })

    return promise
  }

  log(data){
    console.log(data)
  }

  processJobs(job) {
    var newJob = {}
    // console.log(job)
    Object.keys(job).forEach(key => {
      newJob[key] = decodeURIComponent(job[key])
    })
    return newJob
  }

  checkForEvents() {
    try {

      // // console.log(this.job)
      let events: Object = this.job['events']
      this.events = []

      Object.keys(events).map(event => {
        switch (event) {
          case 'created':
            this.events.push({
              event: 'You submitted an application',
              time: this.jobservice.getTime(events[event])
            })
            break
          case 'viewed':
            this.events.push({
              event: 'Your application was viewed',
              time: this.jobservice.getTime(events[event])
            })
            break
          default:
            break
        }
      })
    } catch (e) {
      this.events = null
    }

  }

  load(user) {
    if (!!user) {
      this.user = new AuthUser(user)
    }
    let id = this.route.snapshot.params.id
    this.user = this.user ? this.user : null
    this.jobservice.getJobAsPromise(this.user, id).then(
      res => {
        try {
          this.job = this.processJobs(res['body'])
          this.checkForEvents()
          this.siteVisible = true
          this.alertwindowservice.hide()
        } catch (e) {

        }
      }
    )

  }

  init() {
    setTimeout(() => {
      this.load(this.auth.getUserFromSession())
    }, 400)
    this.auth.$localUser.subscribe(
      localUser => {
        this.load(localUser)
      }
    )
  }



  ngOnInit() {
    window.scrollTo(0, 0)
    this.alertwindowservice.showDataWithoutButton('Loading Job')
    this.init()
  }

}
