import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesVaciosComponent } from './reportes-vacios.component';

describe('ReportesVaciosComponent', () => {
  let component: ReportesVaciosComponent;
  let fixture: ComponentFixture<ReportesVaciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesVaciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesVaciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
