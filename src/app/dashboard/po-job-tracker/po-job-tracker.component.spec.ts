import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoJobTrackerComponent } from './po-job-tracker.component';

describe('PoJobTrackerComponent', () => {
  let component: PoJobTrackerComponent;
  let fixture: ComponentFixture<PoJobTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoJobTrackerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoJobTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
