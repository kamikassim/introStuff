import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertWindowService } from '../../alert-window.service';
import { AuthService } from '../../auth/auth.service';
import { ImageSizerService } from '../../image-sizer.service';
import * as $ from 'jquery'

@Component({
  selector: 'app-all-jobs',
  templateUrl: './all-jobs.component.html',
  styleUrls: ['./all-jobs.component.scss']
})
export class AllJobsComponent implements OnInit {

  jobs = []
  numberOfJobs
  user
  siteVisible: boolean = false
  lastEvaluatedKey: number
  feedHeight: number
  refreshing: boolean
  timesRefreshed:number = 0
  getJobs(lastEvaluatedKey?) {
    let url = 'https://t1v62iqgg7.execute-api.us-east-1.amazonaws.com/prod/getjobs'

    let params = {}

    if (lastEvaluatedKey) {
      params['lastEvaluatedKey'] = {
        id: lastEvaluatedKey
      }
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

  processJobs(jobs) {
    let newJobs = jobs.map(job => {
      var newJob = {}
      Object.keys(job).forEach(key => {
        newJob[key] = decodeURIComponent(job[key])
      })
      newJob = this.setJobLocation(newJob)
      newJob = this.setJobLink(newJob)
      return newJob
    })

    return newJobs

  }

  setJobLocation(job) {
    var location = {
      string: job['jobLocation'],
      commaCount: job['jobLocation'].split(",").length - 1
    }
    let newJob = job
    newJob.jobLocation = location.commaCount > 1 ? 'Multiple' : location.string;
    return newJob
  }

  setJobLink(job) {
    let newJob = job
    newJob.viewLink = 'jobs/view/' + newJob.jobID
    return newJob
  }

  openDetails(route) {
    this.alertwindowservice.showDataWithoutButton('Loading Job')
    setTimeout(() => {
      this.router.navigateByUrl(route)
    }, 400)
  }
  alertActive: boolean

  alertVisible: boolean

  constructor(
    private http: HttpClient, 
    private auth: AuthService, 
    private router: Router, 
    private alertwindowservice: AlertWindowService, 
    private imageTrigger: ImageSizerService
  ) {
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

  checkLocalUser() {
    this.user = this.auth.getUserFromSession()
  }


  onResize() {
    // console.log('page attributes', document.getElementById('feed').clientHeight)
    if (this.feedHeight) {
      this.feedHeight = document.getElementById('feed').clientHeight
    }
  }

  getNextPage() {
    if (!this.refreshing) {
      console.log('refresh is false')
      if (this.lastEvaluatedKey && this.feedHeight) {
        // console.log('window height', $(window).innerHeight())
        // console.log('next page key', this.lastEvaluatedKey)
        // console.log('reached')
        console.log('window scrolltop', $(window).scrollTop())
        console.log('window inner height * 2', $(window).innerHeight() * 2)
        if ($(window).scrollTop() > this.feedHeight - $(window).innerHeight() * 2) {
          this.queryNextPage()
          console.log('reached refresh point')
        } else if ($('body').scrollTop() > this.feedHeight - $(window).innerHeight() * 2) {
          this.queryNextPage()
          console.log('reached refresh point body')
        }
      }
    }
  }

  queryNextPage() {
    if (!this.refreshing) {
      this.refreshing = true
      this.getJobs(this.lastEvaluatedKey).then(
        res => {
          try {
            console.log(res)
            this.lastEvaluatedKey = res['lastEvaluatedKey']['id']
            let jobs = this.processJobs(res['body'])
            jobs.map(
              job => {
                this.jobs.push(job)
              }
            )
            this.numberOfJobs = this.jobs.length
            setTimeout(() => {
              this.feedHeight = document.getElementById('feed').clientHeight
              if(this.timesRefreshed == 0){
                this.timesRefreshed += 2
                window.scroll(0, this.feedHeight - this.feedHeight / this.timesRefreshed)
              }else{
                this.timesRefreshed += 1
                window.scroll(0, this.feedHeight - this.feedHeight / this.timesRefreshed)
              }
              // console.log('refresh reset')
            }, 0);

            setTimeout(() => {
              this.refreshing = false
            }, 400);
          } catch (e) {
            console.log('an error occurred', e)
          }
        }
      )
    }
  }


  ngOnInit() {
    // window.scrollTo(-1000,-1000)
    this.alertwindowservice.showDataWithoutButton('Loading Jobs')
    this.getJobs().then(
      res => {
        // console.log('res', res)
        this.lastEvaluatedKey = res['lastEvaluatedKey']['id']
        // console.log('last eval key', this.lastEvaluatedKey)
        let jobs = this.processJobs(res['body'])
        this.jobs = jobs
        this.numberOfJobs = this.jobs.length
        this.alertwindowservice.hide()
        this.siteVisible = true
        this.imageTrigger.triggerImageLoader('all jobs')
        window.scrollTo(0, 0)
        setTimeout(() => {
          this.feedHeight = document.getElementById('feed').clientHeight
        }, 0);
      })
    this.checkLocalUser()

  }




}
