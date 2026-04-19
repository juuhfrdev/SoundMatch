import { TestBed } from '@angular/core/testing';

import { Dmusic } from './dmusic';

describe('Dmusic', () => {
  let service: Dmusic;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dmusic);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
