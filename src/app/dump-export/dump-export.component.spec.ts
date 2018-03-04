import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DumpExportComponent } from './dump-export.component';

describe('DumpExportComponent', () => {
  let component: DumpExportComponent;
  let fixture: ComponentFixture<DumpExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DumpExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DumpExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
