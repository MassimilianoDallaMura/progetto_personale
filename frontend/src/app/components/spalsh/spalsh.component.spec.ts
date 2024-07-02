import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpalshComponent } from './spalsh.component';

describe('SpalshComponent', () => {
  let component: SpalshComponent;
  let fixture: ComponentFixture<SpalshComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpalshComponent]
    });
    fixture = TestBed.createComponent(SpalshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
