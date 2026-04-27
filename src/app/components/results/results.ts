import { Component, Input } from '@angular/core';
import { Player } from '../player/player';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-results',
  imports: [Player],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class ResultsComponent {
  @Input() originalMusic: any = null;
  @Input() recommendedMusic: any = null;

  @Output() recommendAgain = new EventEmitter<void>();

  handleClick(){
    this.recommendAgain.emit();
  }
}