import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule  } from '@angular/common';
import { EncodeService } from './encode.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class AppComponent implements OnInit {
  inputText: string = '';
  encodedText$: BehaviorSubject<string> | undefined;
  isEncoding$: BehaviorSubject<boolean> | undefined;

  constructor(private encodeService: EncodeService) {}

  ngOnInit() {
    this.encodedText$ = this.encodeService.encodedText$;
    this.isEncoding$ = this.encodeService.isEncoding;
  }

  onEncode() {
    this.encodeService.encodeText(this.inputText);
    this.encodeService.restartSignalRConnection();
  }

  onStop() {
    this.encodeService.stopEncoding();
  }
}
