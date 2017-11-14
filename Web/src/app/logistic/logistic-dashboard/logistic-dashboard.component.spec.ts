import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogisticDashboardComponent } from './logistic-dashboard.component';

describe('LogisticDashboardComponent', () => {
  let component: LogisticDashboardComponent;
  let fixture: ComponentFixture<LogisticDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogisticDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogisticDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
