import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessorInwardComponent } from './processor-inward.component';

describe('ProcessorInwardComponent', () => {
  let component: ProcessorInwardComponent;
  let fixture: ComponentFixture<ProcessorInwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessorInwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessorInwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
