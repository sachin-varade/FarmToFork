import { TestBed, inject } from '@angular/core/testing';

import { AbattoirService } from './abattoir.service';

describe('AbattoirService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AbattoirService]
    });
  });

  it('should be created', inject([AbattoirService], (service: AbattoirService) => {
    expect(service).toBeTruthy();
  }));
});
