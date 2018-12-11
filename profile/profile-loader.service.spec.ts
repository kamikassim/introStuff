import { TestBed, inject } from '@angular/core/testing';

import { ProfileLoaderService } from './profile-loader.service';

describe('ProfileLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileLoaderService]
    });
  });

  it('should be created', inject([ProfileLoaderService], (service: ProfileLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
