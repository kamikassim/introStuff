import { TestBed, inject } from '@angular/core/testing';

import { AlertWindowService } from './alert-window.service';

describe('AlertWindowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertWindowService]
    });
  });

  it('should be created', inject([AlertWindowService], (service: AlertWindowService) => {
    expect(service).toBeTruthy();
  }));
});
