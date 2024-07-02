import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmProductComponent } from './confirm-product.component';

describe('ConfirmProductComponent', () => {
  let component: ConfirmProductComponent;
  let fixture: ComponentFixture<ConfirmProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmProductComponent]
    });
    fixture = TestBed.createComponent(ConfirmProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
