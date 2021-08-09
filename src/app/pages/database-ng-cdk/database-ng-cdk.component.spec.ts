import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseNgCdkComponent } from './database-ng-cdk.component';

describe('DatabaseNgCdkComponent', () => {
  let component: DatabaseNgCdkComponent;
  let fixture: ComponentFixture<DatabaseNgCdkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabaseNgCdkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseNgCdkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
