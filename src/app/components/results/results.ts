import { Component, Input } from '@angular/core';
import { Player } from '../player/player';

@Component({
  selector: 'app-results',
  imports: [Player],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class ResultsComponent {
  @Input() originalMusic: any = null;
  @Input() recommendedMusic: any = null;
}