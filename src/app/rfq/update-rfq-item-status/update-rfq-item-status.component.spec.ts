import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRfqItemStatusComponent } from './update-rfq-item-status.component';

describe('UpdateRfqItemStatusComponent', () => {
  let component: UpdateRfqItemStatusComponent;
  let fixture: ComponentFixture<UpdateRfqItemStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateRfqItemStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateRfqItemStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
