import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticOutwardComponent } from './logistic-outward.component';

describe('LogisticOutwardComponent', () => {
  let component: LogisticOutwardComponent;
  let fixture: ComponentFixture<LogisticOutwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogisticOutwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogisticOutwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
