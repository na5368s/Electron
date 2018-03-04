import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareUpgradeComponent } from './prepare-upgrade.component';

describe('PrepareUpgradeComponent', () => {
  let component: PrepareUpgradeComponent;
  let fixture: ComponentFixture<PrepareUpgradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepareUpgradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
