import { TestBed } from '@angular/core/testing';

import { AuthComponentGuard } from './auth-component.guard';

describe('AuthComponentGuard', () => {
  let guard: AuthComponentGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthComponentGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
