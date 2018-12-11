import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ImageSizerService {

  private imageTriggerSource = new Subject<string>()

  imageTrigger$ = this.imageTriggerSource.asObservable()

  constructor() { }


  triggerImageLoader(state){
    this.imageTriggerSource.next(state)
  }

}
