import { Injectable } from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  isHandset$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  layoutSize$: BehaviorSubject<BreakpointState> =
    new BehaviorSubject<BreakpointState>({} as BreakpointState);

  constructor(private BPObserver: BreakpointObserver) {
    this.BPObserver.observe(Breakpoints.Handset)
      .pipe(map((BPState) => BPState.matches))
      .subscribe((isHandset) => this.isHandset$.next(isHandset));

    this.BPObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe((BPState: BreakpointState) => this.layoutSize$.next(BPState));
  }
}
