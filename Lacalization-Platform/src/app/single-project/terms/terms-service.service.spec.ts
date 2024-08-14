import { TestBed } from '@angular/core/testing';

import { TermsServiceService } from './terms-service.service';

describe('TermsServiceService', () => {
  let service: TermsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TermsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
