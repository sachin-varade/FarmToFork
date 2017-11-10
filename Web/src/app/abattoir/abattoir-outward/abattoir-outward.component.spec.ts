import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbattoirOutwardComponent } from './abattoir-outward.component';

describe('AbattoirOutwardComponent', () => {
  let component: AbattoirOutwardComponent;
  let fixture: ComponentFixture<AbattoirOutwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbattoirOutwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbattoirOutwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
