import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPurchaseOrderItemComponent } from './edit-purchase-order-item.component';

describe('EditPurchaseOrderItemComponent', () => {
  let component: EditPurchaseOrderItemComponent;
  let fixture: ComponentFixture<EditPurchaseOrderItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPurchaseOrderItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPurchaseOrderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
