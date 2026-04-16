import { Component } from '@angular/core';
import { SearchComponent } from '../../components/search/search';
import { ResultsComponent } from '../../components/results/results';

@Component({
  selector: 'app-home',
  imports: [SearchComponent, ResultsComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  musics: any[] = [];

  handleSearch(query: string) {
    console.log('Busca recebida:', query);

    this.musics = [
      { title: 'Blinding Lights', artist: 'The Weeknd' },
      { title: 'Levitating', artist: 'Dua Lipa' },
      { title: 'As It Was', artist: 'Harry Styles' },
      { title: 'Goner', artist: 'Twenty One Pilots'}
    ];
  }
}