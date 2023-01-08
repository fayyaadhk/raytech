import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfqItemComponent } from './rfq-item.component';

describe('RfqItemComponent', () => {
  let component: RfqItemComponent;
  let fixture: ComponentFixture<RfqItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfqItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfqItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
