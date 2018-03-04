import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DumpImportComponent } from './dump-import.component';

describe('DumpImportComponent', () => {
  let component: DumpImportComponent;
  let fixture: ComponentFixture<DumpImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DumpImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DumpImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
