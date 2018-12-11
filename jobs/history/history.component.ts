import { Component, OnInit } from '@angular/core';
import { JobService } from '../job.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  constructor(private jobservice: JobService) { }

  job
  events = []


  

  checkForEvents() {
    try {
      // // console.log(this.job)
      let events: Object = this.job['body']['events']

      Object.keys(events).map(event => {
        switch (event) {
          case 'created':
            console.log(events[event])
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
      // // console.log(e)
    }

  }


  ngOnInit() {

    // let test1 = "str"
    // let test2 = "str"

    // if(!test1 && !test2){
    //   // // console.log('true')
    // }




    // this.user = this.auth.getUserFromSession()
    // this.resumes = this.user.get('resumes')
    // this.stripEmptyResumes()
    // this.jobsService.getJob(this.user, this.getJobId())
    // // console.log(this.jobservice.job)
    this.job = this.jobservice.job
    // // console.log(this.job)
    this.checkForEvents()
    // this.jobservice.$jobData.subscribe(
    //   job => {
    //     this.job = job
    //     this.checkForEvents()
    //     // // // console.log(this.events)
    //   }
    // )
    // this.checkForEvents()
  }

}
