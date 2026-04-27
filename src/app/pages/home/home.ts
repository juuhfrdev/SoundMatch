import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize, switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

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

    this.musicService.searchMusic(query).pipe(
      switchMap((response) => {
        if (!response?.data || response.data.length === 0) {
          this.errorMessage = 'Nenhuma música encontrada.';
          return of(null);
        }

        const baseMusic = response.data[0];

        this.originalMusic = {
          title: baseMusic.title,
          artist: baseMusic.artist.name,
          preview: baseMusic.preview,
          cover: baseMusic.album?.cover_medium
        };

        const originalArtist = baseMusic.artist.name.toLowerCase();
        const albumId = baseMusic.album?.id;

        if (!albumId) {
          this.errorMessage = 'Não consegui identificar o álbum.';
          return of(null);
        }

        return this.musicService.getAlbum(albumId).pipe(
          map(albumResponse => ({
            albumResponse,
            originalArtist
          }))
        );
      }),

  switchMap((data) => {
  if (!data) return of(null);

    const genreName = data.albumResponse?.genres?.data?.[0]?.name;

    if (!genreName) {
      this.errorMessage = 'Não consegui identificar o gênero.';
      return of(null);
    }

    const genreSearchTerms: any = {
      'Alternative': 'indie rock alternative',
      'Pop': 'pop hits',
      'Rock': 'rock band',
      'Rap/Hip Hop': 'hip hop rap',
      'R&B': 'rnb soul',
      'Electronic': 'electronic dance',
      'Dance': 'dance pop',
      'Metal': 'metal rock',
      'Indie': 'indie alternative',
      'Jazz': 'jazz',
      'Soul & Funk': 'soul funk',
      'Reggae': 'reggae',
      'Latin Music': 'latin pop',
      'Country': 'country music',
      'Classical': 'classical music'
    };

    const searchTerm = genreSearchTerms[genreName] || genreName;

    return this.musicService.searchMusic(searchTerm).pipe(
      map(genreResponse => ({
        genreResponse,
        originalArtist: data.originalArtist
      }))
    );
  }),

      map((data) => {
        if (!data) return null;

        const candidates = data.genreResponse.data.filter((item: any) =>
          item.artist.name.toLowerCase() !== data.originalArtist &&
          item.preview
        );

        if (candidates.length === 0) {
          this.errorMessage = 'Nenhuma recomendação encontrada.';
          return null;
        }

        const randomIndex = Math.floor(Math.random() * candidates.length);
        return candidates[randomIndex];
      }),

      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (rec) => {
        if (!rec) return;

        this.recommendedMusic = {
          title: rec.title,
          artist: rec.artist.name,
          preview: rec.preview,
          cover: rec.album?.cover_medium
        };

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erro ao gerar recomendação.';
      }
    });
  }
}