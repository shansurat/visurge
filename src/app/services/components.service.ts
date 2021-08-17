import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComponentsService {
  zenMode$ = new BehaviorSubject(false);

  constructor() {}

  setZenMode(mode: boolean) {
    this.zenMode$.next(mode);
  }

  get zenMode(): boolean {
    return this.zenMode$.getValue();
  }
}
