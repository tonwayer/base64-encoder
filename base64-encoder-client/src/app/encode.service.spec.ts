import { TestBed } from '@angular/core/testing';
import { EncodeService } from './encode.service';
import { environment } from '../environments/environment';
import * as signalR from '@microsoft/signalr';

describe('EncodeService', () => {
  let service: EncodeService;
  let mockHubConnection: jasmine.SpyObj<signalR.HubConnection>;

  beforeEach(() => {
    mockHubConnection = jasmine.createSpyObj('HubConnection', ['start', 'stop', 'on', 'send', 'invoke']);
    
    TestBed.configureTestingModule({
      providers: [
        EncodeService,
        { provide: signalR.HubConnectionBuilder, useValue: { build: () => mockHubConnection } }
      ]
    });

    service = TestBed.inject(EncodeService);

    // Mock the fetch function
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(new Response(null, { status: 200 })));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request with correct headers and payload', async () => {
    const inputText = 'Hello, World!';
    
    // Call the encodeText method and wait for it to complete
    await service.encodeText(inputText);
    
    // Use environment.apiUrl instead of service['baseUrl']
    expect(window.fetch).toHaveBeenCalledWith(`${environment.apiUrl}/api/encode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: inputText })
    });
  });

  it('should handle empty input text gracefully', async () => {
    spyOn(window, 'alert'); // Spy on alert to prevent it from showing in tests

    // Call the encodeText method with empty input
    await service.encodeText('');

    // Ensure that no fetch request is made
    expect(window.fetch).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Please provide text to encode.');
  });
});
