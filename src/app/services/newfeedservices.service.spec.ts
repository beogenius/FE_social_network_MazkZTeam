import { TestBed } from '@angular/core/testing';

import { NewfeedservicesService } from './newfeedservices.service';

describe('NewfeedservicesService', () => {
  let service: NewfeedservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewfeedservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
