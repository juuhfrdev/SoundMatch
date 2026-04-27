import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize, switchMap, map } from 'rxjs/operators';
import { of, from } from 'rxjs';

import { SearchComponent } from '../../components/search/search';
import { ResultsComponent } from '../../components/results/results';
import { MusicService } from '../../services/dmusic';
import { LastfmService } from '../../services/lastfm';
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
    private LastfmService:  LastfmService,
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

      // 1. Busca a música digitada no Deezer
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

        const originalArtist = baseMusic.artist.name;
        const originalTitle = baseMusic.title;

        // 2. Busca músicas parecidas no Last.fm
        return this.LastfmService.getSimilarTracks(originalTitle, originalArtist).pipe(
          map((lastfmResponse) => ({
            lastfmResponse,
            originalArtist: originalArtist.toLowerCase(),
            originalTitle: originalTitle.toLowerCase()
          }))
        );
      }),

      // 3. Pega recomendações do Last.fm e procura no Deezer para ter preview/capa
      switchMap((data) => {
        if (!data) return of(null);

        const similarTracks = [...(data.lastfmResponse?.similartracks?.track || [])].sort(() => Math.random() - 0.5);

        if (similarTracks.length === 0) {
          this.errorMessage = 'Nenhuma música parecida encontrada no Last.fm.';
          return of(null);
        }

        return from(similarTracks).pipe(
          switchMap((track: any) => {
            const trackName = track.name;
            const artistName = track.artist?.name;

            if (!trackName || !artistName) {
              return of(null);
            }

            const searchQuery = `${trackName} ${artistName}`;

            return this.musicService.searchMusic(searchQuery).pipe(
              map((deezerResponse) => {
                const result = deezerResponse?.data?.find((music: any) => {
                  const sameTitle =
                    music.title.toLowerCase() === data.originalTitle;

                    const sameArtist =
                    music.artist.name.toLowerCase() === data.originalArtist;

                    const sameRecommended =
                    this.recommendedMusic &&
                    music.title.toLowerCase() === this.recommendedMusic.title.toLowerCase() &&
                    music.artist.name.toLowerCase() === this.recommendedMusic.artist.toLowerCase();

                    return !sameTitle && !sameArtist && !sameRecommended && music.preview;
                  });

                return result || null;
              })
            );
          }),
          map((result) => result),
        );
      }),

      // 4. Filtra o primeiro resultado válido com preview
      map((rec) => {
        if (!rec) return null;

        return {
          title: rec.title,
          artist: rec.artist.name,
          preview: rec.preview,
          cover: rec.album?.cover_medium
        };
      }),

      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })

    ).subscribe({
      next: (rec) => {
        if (!rec || this.recommendedMusic) return;

        this.recommendedMusic = rec;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Erro ao gerar recomendação.';
        this.cdr.detectChanges();
      }
    });
  }
}