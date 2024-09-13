import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncodeService {
  public hubConnection: signalR.HubConnection | undefined;
  public encodedText$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {
    this.startSignalRConnection();
  }

  private startSignalRConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}` + '/encodehub')
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
    return fetch(`${environment.apiUrl}` + '/api/encode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({input})
    });
  }

  public stopSignalRConnection() {
    this.hubConnection?.stop();
  }
}
