import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePOFromRFQComponent } from './create-pofrom-rfq.component';

describe('CreatePOFromRFQComponent', () => {
  let component: CreatePOFromRFQComponent;
  let fixture: ComponentFixture<CreatePOFromRFQComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePOFromRFQComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePOFromRFQComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
