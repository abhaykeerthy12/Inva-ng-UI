import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPicComponent } from './register-pic.component';

describe('RegisterPicComponent', () => {
  let component: RegisterPicComponent;
  let fixture: ComponentFixture<RegisterPicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterPicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
