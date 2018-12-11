import { TestBed, inject } from '@angular/core/testing';

import { ImageSizerService } from './image-sizer.service';

describe('ImageSizerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageSizerService]
    });
  });

  it('should be created', inject([ImageSizerService], (service: ImageSizerService) => {
    expect(service).toBeTruthy();
  }));
});
