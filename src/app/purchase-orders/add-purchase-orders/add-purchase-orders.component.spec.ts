import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPurchaseOrdersComponent } from './add-purchase-orders.component';

describe('AddPurchaseOrdersComponent', () => {
  let component: AddPurchaseOrdersComponent;
  let fixture: ComponentFixture<AddPurchaseOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPurchaseOrdersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPurchaseOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
