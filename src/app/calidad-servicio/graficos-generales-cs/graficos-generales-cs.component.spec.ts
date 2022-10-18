import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficosGeneralesCsComponent } from './graficos-generales-cs.component';

describe('GraficosGeneralesCsComponent', () => {
  let component: GraficosGeneralesCsComponent;
  let fixture: ComponentFixture<GraficosGeneralesCsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficosGeneralesCsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficosGeneralesCsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
