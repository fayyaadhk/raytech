import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupplierItemComponent } from './add-supplier-item.component';

describe('AddSupplierItemComponent', () => {
  let component: AddSupplierItemComponent;
  let fixture: ComponentFixture<AddSupplierItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSupplierItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSupplierItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
