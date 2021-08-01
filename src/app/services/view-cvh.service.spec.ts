import { TestBed } from '@angular/core/testing';

import { ViewCVHService } from './view-cvh.service';

describe('ViewCVHService', () => {
  let service: ViewCVHService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewCVHService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
