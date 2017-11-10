import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbattoirInwardComponent } from './abattoir-inward.component';

describe('AbattoirInwardComponent', () => {
  let component: AbattoirInwardComponent;
  let fixture: ComponentFixture<AbattoirInwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbattoirInwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbattoirInwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
