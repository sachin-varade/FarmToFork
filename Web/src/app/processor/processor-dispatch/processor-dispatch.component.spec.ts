import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessorDispatchComponent } from './processor-dispatch.component';

describe('ProcessorDispatchComponent', () => {
  let component: ProcessorDispatchComponent;
  let fixture: ComponentFixture<ProcessorDispatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessorDispatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessorDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
