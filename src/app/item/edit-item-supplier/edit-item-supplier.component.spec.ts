import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditItemSupplierComponent } from './edit-item-supplier.component';

describe('EditItemSupplierComponent', () => {
  let component: EditItemSupplierComponent;
  let fixture: ComponentFixture<EditItemSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditItemSupplierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditItemSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
