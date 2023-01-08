import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRfqComponent } from './add-rfq.component';

describe('AddRfqComponent', () => {
  let component: AddRfqComponent;
  let fixture: ComponentFixture<AddRfqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRfqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRfqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
