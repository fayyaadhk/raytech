import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqSummaryComponent } from './rfq-summary.component';

describe('RfqSummaryComponent', () => {
  let component: RfqSummaryComponent;
  let fixture: ComponentFixture<RfqSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfqSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfqSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
