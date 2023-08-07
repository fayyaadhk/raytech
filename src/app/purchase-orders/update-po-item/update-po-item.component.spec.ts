import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePoItemComponent } from './update-po-item.component';

describe('UpdatePoItemComponent', () => {
  let component: UpdatePoItemComponent;
  let fixture: ComponentFixture<UpdatePoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePoItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
