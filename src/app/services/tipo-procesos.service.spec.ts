import { TestBed } from '@angular/core/testing';

import { TipoProcesosService } from './tipo-procesos.service';

describe('TipoProcesosService', () => {
  let service: TipoProcesosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoProcesosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
