import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRFQItemComponent } from './edit-rfqitem.component';

describe('EditRFQItemComponent', () => {
  let component: EditRFQItemComponent;
  let fixture: ComponentFixture<EditRFQItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRFQItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRFQItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
