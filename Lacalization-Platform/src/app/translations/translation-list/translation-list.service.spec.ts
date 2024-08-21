import { TestBed } from '@angular/core/testing';

import { TranslationListService } from './translation-list.service';

describe('TranslationListService', () => {
  let service: TranslationListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
