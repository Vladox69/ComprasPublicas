import { TestBed } from '@angular/core/testing';

import { ResolucionesService } from './resoluciones.service';

describe('ResolucionesService', () => {
  let service: ResolucionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResolucionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
