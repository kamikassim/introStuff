import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVideoThumbnailComponent } from './edit-video-thumbnail.component';

describe('EditVideoThumbnailComponent', () => {
  let component: EditVideoThumbnailComponent;
  let fixture: ComponentFixture<EditVideoThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVideoThumbnailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVideoThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
