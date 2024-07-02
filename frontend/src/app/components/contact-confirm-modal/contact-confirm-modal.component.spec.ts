import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactConfirmModalComponent } from './contact-confirm-modal.component';

describe('ContactConfirmModalComponent', () => {
  let component: ContactConfirmModalComponent;
  let fixture: ComponentFixture<ContactConfirmModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactConfirmModalComponent]
    });
    fixture = TestBed.createComponent(ContactConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
