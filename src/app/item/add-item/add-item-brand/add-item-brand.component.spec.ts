import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemBrandComponent } from './add-item-brand.component';

describe('AddItemBrandComponent', () => {
  let component: AddItemBrandComponent;
  let fixture: ComponentFixture<AddItemBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddItemBrandComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddItemBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
