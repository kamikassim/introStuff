import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDetailViewComponent } from './job-detail-view.component';

describe('JobDetailViewComponent', () => {
  let component: JobDetailViewComponent;
  let fixture: ComponentFixture<JobDetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobDetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
