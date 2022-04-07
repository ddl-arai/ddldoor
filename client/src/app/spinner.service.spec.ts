import { TestBed } from '@angular/core/testing';

import { SpinnerService } from './spinner.service';

import { OverlayModule } from '@angular/cdk/overlay'

describe('SpinnerService', () => {
  let service: SpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [OverlayModule]});
    service = TestBed.inject(SpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
