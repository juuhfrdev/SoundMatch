import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-results',
  imports: [],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class ResultsComponent {
  @Input() musics: any[] = [];
  @Input() loading: boolean = false;
}