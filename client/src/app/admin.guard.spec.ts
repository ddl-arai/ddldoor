import { TestBed } from '@angular/core/testing';

import { AdminGuard } from './admin.guard';

import { AppModule } from './app.module';

describe('AdminGuard', () => {
  let guard: AdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [ AppModule ]});
    guard = TestBed.inject(AdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
