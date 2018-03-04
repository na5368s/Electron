import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckUpdatesComponent } from './check-updates.component';

describe('CheckUpdatesComponent', () => {
  let component: CheckUpdatesComponent;
  let fixture: ComponentFixture<CheckUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckUpdatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
