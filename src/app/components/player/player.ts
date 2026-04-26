import { Component, Input, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.html',
  styleUrl: './player.css',
})
export class Player {
  @Input() previewUrl: string = '';

  audio = new Audio();

  isPlaying = false;
  currentTime = 0;
  duration = 0;

  constructor(private cdr: ChangeDetectorRef) {
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime;
      this.cdr.detectChanges();
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio.duration;
      this.cdr.detectChanges();
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.currentTime = 0;
      this.cdr.detectChanges();
    });
  }

  togglePlay() {
    if (!this.previewUrl) return;

    if (this.audio.src !== this.previewUrl) {
      this.audio.src = this.previewUrl;
    }

    if (this.audio.paused) {
      this.audio.play();
      this.isPlaying = true;
    } else {
      this.audio.pause();
      this.isPlaying = false;
    }

    this.cdr.detectChanges();
  }

  seek(event: Event) {
    const input = event.target as HTMLInputElement;
    this.audio.currentTime = Number(input.value);
    this.currentTime = this.audio.currentTime;
    this.cdr.detectChanges();
  }

  formatTime(time: number): string {
    if (!time || isNaN(time)) return '0:00';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}