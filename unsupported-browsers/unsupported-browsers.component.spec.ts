import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsupportedBrowsersComponent } from './unsupported-browsers.component';

describe('UnsupportedBrowsersComponent', () => {
  let component: UnsupportedBrowsersComponent;
  let fixture: ComponentFixture<UnsupportedBrowsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsupportedBrowsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsupportedBrowsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
