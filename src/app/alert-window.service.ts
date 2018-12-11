import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';

@Injectable()
export class AlertWindowService {

  private alertWindowSource = new Subject<string>()
  private alertWindowDataSource = new Subject<string>()
  private alertWindowActiveSource = new Subject<boolean>()
  private alertWindowVisibleSource = new Subject<boolean>()
  private nextPageSource = new Subject<string>()
  private buttonVisibilitySource = new Subject<boolean>()
  

  alertWindowState$ = this.alertWindowSource.asObservable()
  buttonVisibility$ = this.buttonVisibilitySource.asObservable()
  nextPageLink$ = this.nextPageSource.asObservable()
  alertDataSource$ = this.alertWindowDataSource.asObservable()
  alertActiveState$ = this.alertWindowActiveSource.asObservable()
  alertVisibleState$ = this.alertWindowVisibleSource.asObservable()

  nextPage:string = null

  constructor(private router:Router) {}

  setState(state:string){
    this.alertWindowSource.next(state)
  }

  setData(data:string){
    this.alertWindowDataSource.next(data)
  }

  show(){
    this.alertWindowActiveSource.next(true)
    this.alertWindowVisibleSource.next(true)
  }

  hideButton(){
    this.buttonVisibilitySource.next(false)
  }

  showButton(){
    this.buttonVisibilitySource.next(true)
  }

  showWithButton(){
    this.showButton()
    this.show()
  }

  showWithoutButton(){
    this.hideButton()
    this.show()
  }

  showDataWithButton(data:string){
    this.setData(data)
    this.showWithButton()
  }

  showDataWithoutButton(data:string){
    this.setData(data)
    this.showWithoutButton()
  }

  setNextPage(next:string){
    this.nextPageSource.next(next)
    this.nextPage = next
  }

  clearNextPage(){
    this.nextPageSource.next(null)
    this.nextPage = null
  }

  hide(){
    // // // // console.log('hide called')
    this.alertWindowVisibleSource.next(false)
    if(this.nextPage && this.nextPage.length > 0){
      this.router.navigateByUrl(this.nextPage)
      this.clearNextPage()
    }
    setTimeout(()=>{
      this.alertWindowActiveSource.next(false)
    }, 400)
  }

}
