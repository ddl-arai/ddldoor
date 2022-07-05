import { Injectable } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatprogressspinnerComponent } from '../components/matprogressspinner/matprogressspinner.component';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  constructor(
    private overlay: Overlay
  ) { }

  overlayRef = this.overlay.create({
    hasBackdrop: true,
    positionStrategy: this.overlay
      .position().global().centerHorizontally().centerVertically()
  });

  attach(): void {
    this.overlayRef.attach(new ComponentPortal(MatprogressspinnerComponent));
  }
  
  detach(): void {
    this.overlayRef.detach();
  }
}
