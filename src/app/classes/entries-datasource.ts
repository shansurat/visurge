import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserEntry } from '../interfaces/user-entry';
import { EntriesService } from '../services/entries.service';

export class EntriesDatasource implements DataSource<UserEntry> {
  private lessonsSubject = new BehaviorSubject<UserEntry[]>([]);

  constructor(private entriesServ: EntriesService) {}

  connect(collectionViewer: CollectionViewer): Observable<UserEntry[]> {
    return of([]);
  }

  disconnect(collectionViewer: CollectionViewer): void {}

  loadEntries(
    courseId: number,
    filter: string,
    sortDirection: string,
    pageIndex: number,
    pageSize: number
  ) {}
}
