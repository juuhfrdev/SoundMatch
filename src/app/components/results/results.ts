import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-results',
  imports: [],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class ResultsComponent {
  @Input() originalMusic: any = null;
  @Input() recommendedMusic: any = null;
  @Input() loading: boolean = false;
}