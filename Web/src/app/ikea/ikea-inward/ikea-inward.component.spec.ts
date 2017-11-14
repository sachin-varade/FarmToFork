import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IkeaInwardComponent } from './ikea-inward.component';

describe('IkeaInwardComponent', () => {
  let component: IkeaInwardComponent;
  let fixture: ComponentFixture<IkeaInwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IkeaInwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IkeaInwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
