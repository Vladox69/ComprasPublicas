import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficosVacioComponent } from './graficos-vacio.component';

describe('GraficosVacioComponent', () => {
  let component: GraficosVacioComponent;
  let fixture: ComponentFixture<GraficosVacioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficosVacioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficosVacioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
