import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticInwardComponent } from './logistic-inward.component';

describe('LogisticInwardComponent', () => {
  let component: LogisticInwardComponent;
  let fixture: ComponentFixture<LogisticInwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogisticInwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogisticInwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
