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
  originalMusic: any = null;
  recommendedMusic: any = null;

  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private musicService: MusicService,
    private cdr: ChangeDetectorRef
  ) {}

  handleSearch(query: string) {
    if (!query.trim()) return;

    this.loading = true;
    this.errorMessage = '';
    this.originalMusic = null;
    this.recommendedMusic = null;
    this.cdr.detectChanges();

    this.musicService.searchMusic(query).subscribe({
      next: (response) => {
        if (!response?.data || response.data.length === 0) {
          this.errorMessage = 'Nenhuma música encontrada.';
          this.loading = false;
          this.cdr.detectChanges();
          return;
        }

        const baseMusic = response.data[0];

        this.originalMusic = {
          title: baseMusic.title,
          artist: baseMusic.artist.name,
          preview: baseMusic.preview,
          cover: baseMusic.album?.cover_medium
        };

        const artistName = baseMusic.artist.name;
        const originalTitle = baseMusic.title.toLowerCase();

        this.musicService.searchArtistTracks(artistName)
          .pipe(finalize(() => {
            this.loading = false;
            this.cdr.detectChanges();
          }))
          .subscribe({
            next: (artistResponse) => {
              if (!artistResponse?.data || artistResponse.data.length === 0) {
                this.errorMessage = 'Não encontrei músicas parecidas.';
                return;
              }

              const filtered = artistResponse.data.filter((item: any) =>
                item.title.toLowerCase() !== originalTitle
              );

              if (filtered.length === 0) {
                this.errorMessage = 'Não encontrei outra música para recomendar.';
                return;
              }

              const randomIndex = Math.floor(Math.random() * filtered.length);
              const rec = filtered[randomIndex]; //faz procurar sempre uma musica diferente

              this.recommendedMusic = {
                title: rec.title,
                artist: rec.artist.name,
                preview: rec.preview,
                cover: rec.album?.cover_medium
              };

              this.cdr.detectChanges();
            },
            error: (error) => {
              console.error('Erro ao buscar músicas do artista:', error);
              this.errorMessage = 'Erro ao gerar recomendação.';
            }
          });
      },
      error: (error) => {
        console.error('Erro ao buscar música:', error);
        this.errorMessage = 'Erro ao buscar música.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}