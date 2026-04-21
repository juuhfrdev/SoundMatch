import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

import { SearchComponent } from '../../components/search/search';
import { ResultsComponent } from '../../components/results/results';
import { MusicService } from '../../services/dmusic';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-home',
  imports: [CommonModule, SearchComponent, ResultsComponent, Header],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  musics: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private musicService: MusicService,
    private cdr: ChangeDetectorRef
  ) {}

  handleSearch(query: string) {
    this.loading = true;
    this.errorMessage = '';
    this.musics = [];
    this.cdr.detectChanges();

    this.musicService.searchMusic(query)
      .pipe(finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (response) => {
          this.musics = response.data.map((item: any) => ({
                title: item.title,
                artist: item.artist.name,
                preview: item.preview,
                cover: item.album?.cover_medium
              }));
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('ERRO NA API:', error);
          this.errorMessage = 'Não foi possível buscar músicas agora.';
          this.cdr.detectChanges();
        }
      });
  }
}