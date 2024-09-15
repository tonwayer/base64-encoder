import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EncodeService } from './encode.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

describe('EncodeService', () => {
  let service: EncodeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EncodeService]
    });

    service = TestBed.inject(EncodeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request with correct headers and payload', () => {
    const inputText = 'Hello, World!';
    const expectedHeaders = {
      'Content-Type': 'application/json'
    };

    service.encodeText(inputText).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/encode`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ input: inputText });

    expect(req.request.headers.get('Authorization')).toBe(expectedHeaders.Authorization);
    expect(req.request.headers.get('Content-Type')).toBe(expectedHeaders['Content-Type']);

    req.flush({});
  });

  it('should handle empty input text gracefully', () => {
    service.encodeText('').subscribe({
      next: () => fail('The request should not succeed with empty input'),
      error: (error) => expect(error).toBeTruthy()
    });

    // Ensure no request is made
    httpMock.expectNone(`${environment.apiUrl}/api/encode`);
  });
});
