import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrdersItemComponent } from './purchase-orders-item.component';

describe('PurchaseOrdersItemComponent', () => {
  let component: PurchaseOrdersItemComponent;
  let fixture: ComponentFixture<PurchaseOrdersItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrdersItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrdersItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
