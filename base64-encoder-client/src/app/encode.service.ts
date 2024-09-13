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
      .withUrl(`${environment.apiUrl}/encodehub`)
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .build();

    this.hubConnection.on('ReceiveCharacter', (char: string) => {
      const currentText = this.encodedText$.value;
      this.encodedText$.next(currentText + char);
    });

    this.hubConnection
      .start()
      .then(() => console.log('SignalR connection established.'))
      .catch(err => console.error('SignalR Error: ', err));
  }

  public encodeText(input: string) {
    if (input.trim() === "") {
      alert("Please provide text to encode.");
      return;
    }
    return fetch(`${environment.apiUrl}/api/encode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input })
    });
  }

  public stopSignalRConnection() {
    this.hubConnection?.stop();
  }

  public stopEncoding() {
    this.stopSignalRConnection();
    this.encodedText$.next('');
  }
}
