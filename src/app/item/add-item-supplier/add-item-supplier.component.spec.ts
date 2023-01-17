import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemSupplierComponent } from './add-item-supplier.component';

describe('AddItemSupplierComponent', () => {
  let component: AddItemSupplierComponent;
  let fixture: ComponentFixture<AddItemSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddItemSupplierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddItemSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
