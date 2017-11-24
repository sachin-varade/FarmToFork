import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IkeaOutwardComponent } from './ikea-outward.component';

describe('IkeaOutwardComponent', () => {
  let component: IkeaOutwardComponent;
  let fixture: ComponentFixture<IkeaOutwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IkeaOutwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IkeaOutwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
