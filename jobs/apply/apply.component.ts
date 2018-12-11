import { Component, OnInit } from '@angular/core';
import { AuthUser } from '../../classes/auth-user';
import { AuthService } from '../../auth/auth.service';
import { Resume } from '../../classes/resume';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertWindowService } from '../../alert-window.service';
import { JobService } from '../job.service';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {

  constructor(private jobsService: JobService, private auth: AuthService, private route: ActivatedRoute, private http: HttpClient, private aws: AlertWindowService) { }

  user: AuthUser
  resumes: Array<Resume>
  applicationStatus: string = 'empty'

  selectedIndex: number = null
  applyReady: boolean = false
  noResumes:boolean = false
  job: Object
  events = []

  getJobId() {
    let params = this.route.snapshot.params.id
    return params
  }

  apply() {
    this.aws.showDataWithoutButton('Sending Application')
    let jobId = this.getJobId()
    let prefix = 'https://d2z9zoe9y0iysn.cloudfront.net/profile/' // cloudfront url, switch to myintro during prod
    let userUrl = prefix + this.user.get('username') + '/recruiter/' + jobId//url
    let url = 'https://t1v62iqgg7.execute-api.us-east-1.amazonaws.com/prod/createjobapplication'
    let params = {
      userId: this.user.get('uid'),
      resumeType: this.selectedIndex,
      jobId: jobId,
      url: userUrl, // profile url
      name: this.user.get('firstname') // person's name
    }
    // // console.log(params)

    // let promise = new Promise((resolve, reject) => {
    this.http.request("POST", url, {
      body: params,
      headers: {
        'Content-Type': 'application/json'
      }
    }).toPromise().then(
      res => {
        // // console.log(res)
        this.aws.showDataWithButton('Application Sent')
        this.applicationStatus = 'submitted'
        this.refreshJob()
      },
      err => {
        this.aws.showDataWithButton('Application Failed to Send')
      }
    )
    // })
    // !event.userId, !event.resumeType, !event.jobId, !event.url, !event.name
  }

  refreshJob() {
    this.jobsService.getJob(this.user, this.getJobId())
  }

  getTime(timestamp) {
    return timestamp
  }

  checkForEvents() {
    try {

      let events: Object = this.job['body']['events']

      // // // console.log(Object.keys(events).length > 0)
      if (Object.keys(events).length > 0) {
        this.applicationStatus = 'submitted'
        Object.keys(events).map(event => {
          switch (event) {
            case 'created':
              this.events.push({
                event: 'You submitted an application.',
                time: this.getTime(events[event])
              })
              break
            case 'viewed':
              this.events.push({
                event: 'Your application was viewed.',
                time: this.getTime(events[event])
              })
              break
            default:
              break
          }
        })
      }
    } catch (e) {

    }


  }

  select(index: number) {
    this.selectedIndex = index
    this.applyReady = true
  }

  stripEmptyResumes() {
    let resumeReplacer: Array<Resume> = []
    let index = 0
    this.resumes.map(resume => {
      // console.log(resume.url)
      if (!!resume.url && resume.url != null) {
        // console.log('reached')
        resumeReplacer[index] = resume
      }
      index++
    })
    this.resumes = resumeReplacer
    this.noResumes = this.resumes.length == 0
  }

  ngOnInit() {
    this.user = this.auth.getUserFromSession()
    if(!!this.user){
      this.resumes = this.user.get('resumes')
      this.stripEmptyResumes()
      this.jobsService.getJob(this.user, this.getJobId())
      this.jobsService.$jobData.subscribe(
        job => {
          this.job = job
          this.checkForEvents()
        }
      )
    }
  }

}
