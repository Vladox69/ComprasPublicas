import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficosCsComponent } from './graficos-cs.component';

describe('GraficosCsComponent', () => {
  let component: GraficosCsComponent;
  let fixture: ComponentFixture<GraficosCsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficosCsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficosCsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
