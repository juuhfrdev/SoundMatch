import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class SearchComponent {
  query: string = '';

  @Output() onSearch = new EventEmitter<string>();

  search() {
    console.log('CLIQUEI NO BOTÃO');
    console.log('Texto digitado:', this.query);
    this.onSearch.emit(this.query);
  }
}