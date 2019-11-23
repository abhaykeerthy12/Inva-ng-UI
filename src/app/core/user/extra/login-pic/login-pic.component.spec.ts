import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPicComponent } from './login-pic.component';

describe('LoginPicComponent', () => {
  let component: LoginPicComponent;
  let fixture: ComponentFixture<LoginPicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
