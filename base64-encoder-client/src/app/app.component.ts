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

  constructor(private encodeService: EncodeService) {}

  ngOnInit() {
    this.encodedText$ = this.encodeService.encodedText$;
  }

  onEncode() {
    this.encodeService.encodeText(this.inputText);
  }

  onStop() {
    this.encodeService.stopEncoding();
  }
}
