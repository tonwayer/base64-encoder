import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { EncodeService } from './encode.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,  // Define this component as standalone
  imports: [FormsModule]  // Import FormsModule directly here
})
export class AppComponent {
  inputText: string = '';  // User input text
  encodedText: string = '';  // Encoded Base64 text
  isProcessing: boolean = false;  // Flag to disable buttons during processing

  constructor(private encodeService: EncodeService) {
    // Subscribe to the service to update the encoded text in real time
    this.encodeService.encodedText$.subscribe(text => {
      this.encodedText = text;
    });
  }

  // Handle the Convert button click to start encoding
  convertText() {
    this.isProcessing = true;
    this.encodedText = '';  // Reset the encoded text
    this.encodeService.encodedText$.next('');  // Clear the BehaviorSubject value
    this.encodeService.encodeText(this.inputText)
      .then(() => this.isProcessing = false)  // Once complete, stop processing
      .catch(err => console.error('Error: ', err));
  }

  // Handle the Cancel button click to stop encoding
  cancelProcessing() {
    this.isProcessing = false;
    this.encodeService.stopSignalRConnection();  // Stop SignalR connection
  }
}