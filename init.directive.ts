import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appInit]',
  exportAs: '[appInit]'
})
export class InitDirective {

  @Input() values: any = {};

  @Input() appInit;
  ngOnInit() {
    if(this.appInit) { this.appInit(); }
  }  
  constructor() { }

}

// @Directive({
//   selector: 'ngInit',
//   exportAs: 'ngInit'
// }) 
// export class NgInit {
//   
// }