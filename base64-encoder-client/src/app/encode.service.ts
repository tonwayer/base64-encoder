import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EncodeService {
  public hubConnection: signalR.HubConnection | undefined;
  private baseUrl: string = 'http://localhost:5199';
  public encodedText$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {
    this.startSignalRConnection();
  }

  private startSignalRConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.baseUrl + '/encodehub')
      .build(); 

    this.hubConnection.on('ReceiveCharacter', (char: string) => {
      const currentText = this.encodedText$.value;
      this.encodedText$.next(currentText + char);
    });

    this.hubConnection
      .start()
      .catch(err => console.error('SignalR Error: ', err));
  }

  public encodeText(input: string) {
    return fetch(this.baseUrl + '/api/encode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({input})
    });
  }

  public stopSignalRConnection() {
    this.hubConnection?.stop();
  }
}
