import { TestBed } from '@angular/core/testing';

import { ComprasPublicasService } from './compras-publicas.service';

describe('ComprasPublicasService', () => {
  let service: ComprasPublicasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComprasPublicasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
