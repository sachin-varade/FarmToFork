import { TestBed, inject } from '@angular/core/testing';

import { IkeaService } from './ikea.service';

describe('IkeaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IkeaService]
    });
  });

  it('should be created', inject([IkeaService], (service: IkeaService) => {
    expect(service).toBeTruthy();
  }));
});
