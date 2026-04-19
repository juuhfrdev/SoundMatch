import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class SearchComponent {
  @Output() onSearch = new EventEmitter<string>();

  search(value: string) {
    const query = value.trim();

    if (!query) return;

    console.log('emitindo busca:', query);
    this.onSearch.emit(query);
  }
}