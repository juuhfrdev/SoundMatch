import { Component, EventEmitter, Output } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class SearchComponent {

  @Input() loading: boolean = false;

  @Output() onSearch = new EventEmitter<string>();

  search(value: string) {
    console.log('cliquei no botão');

    const query = value.trim();
    if (!query) return;

    console.log('emitindo busca:', query);
    this.onSearch.emit(query);
  }
}