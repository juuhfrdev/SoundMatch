import { Component, Input, ChangeDetectorRef, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.html',
  styleUrl: './player.css',
})
export class Player implements OnChanges, OnDestroy {
  @Input() previewUrl: string = '';

  // Guarda qual player está tocando atualmente (compartilhado entre todos)
  private static currentPlayer: Player | null = null;

  audio = new Audio();

  isPlaying = false;
  currentTime = 0;
  duration = 0;

  animationFrameId: number | null = null;

  constructor(private cdr: ChangeDetectorRef) {

    // Atualiza a timeline enquanto a música toca
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.audio.currentTime;
      this.cdr.detectChanges();
    });

    // Pega a duração do preview quando o áudio carrega
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio.duration;
      this.cdr.detectChanges();
    });

    // Quando o áudio termina, reseta o player
    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.currentTime = 0;

      // Para a atualização contínua da timeline
      this.stopProgressUpdate();

      if (Player.currentPlayer === this) {
        Player.currentPlayer = null;
      }

      this.cdr.detectChanges();
    });
  }

  // Detecta quando a música muda
  ngOnChanges(changes: SimpleChanges) {
    if (changes['previewUrl']) {

      // Para qualquer áudio atual
      this.stop();

      // Reseta estado
      this.currentTime = 0;
      this.duration = 0;

      // Carrega nova música
      if (this.previewUrl) {
        this.audio.src = this.previewUrl;
        this.audio.load();
      }

      // Remove como player ativo
      if (Player.currentPlayer === this) {
        Player.currentPlayer = null;
      }

      this.cdr.detectChanges();
    }
  }
  getProgressBackground(): string {
  const progress = this.duration 
    ? (this.currentTime / this.duration) * 100 
    : 0;

  return `linear-gradient(
    90deg,
    #4DA6FF 0%,
    #6F7CFF ${progress}%,
    rgba(255, 255, 255, 0.2) ${progress}%,
    rgba(255, 255, 255, 0.2) 100%
  )`;
}

  // Inicia a atualização contínua da timeline
  startProgressUpdate() {
    this.stopProgressUpdate();

    const update = () => {
      if (!this.audio.paused) {
        this.currentTime = this.audio.currentTime;
        this.cdr.detectChanges();

        this.animationFrameId = requestAnimationFrame(update);
      }
    };

    this.animationFrameId = requestAnimationFrame(update);
  }

  // Para a atualização contínua da timeline
  stopProgressUpdate() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  // Play / Pause
  togglePlay() {
    if (!this.previewUrl) return;

    // Garante que o src está correto
    if (this.audio.src !== this.previewUrl) {
      this.audio.src = this.previewUrl;
    }

    if (this.audio.paused) {

      // Para outro player antes de tocar
      if (Player.currentPlayer && Player.currentPlayer !== this) {
        Player.currentPlayer.stop();
      }

      this.audio.play();
      this.isPlaying = true;

      // Inicia a atualização da barra enquanto toca
      this.startProgressUpdate();

      // Marca como player ativo
      Player.currentPlayer = this;

    } else {

      this.audio.pause();
      this.isPlaying = false;

      // Para a atualização da barra ao pausar
      this.stopProgressUpdate();

      if (Player.currentPlayer === this) {
        Player.currentPlayer = null;
      }
    }

    this.cdr.detectChanges();
  }

  // Para o áudio
  stop() {
    this.audio.pause();
    this.isPlaying = false;

    // Para a atualização da barra
    this.stopProgressUpdate();

    this.cdr.detectChanges();
  }

  // Método global pra parar qualquer player
  static stopCurrentPlayer() {
    if (Player.currentPlayer) {
      Player.currentPlayer.stop();
      Player.currentPlayer = null;
    }
  }

  // Quando o componente é destruído (ex: nova busca)
  ngOnDestroy() {
    this.stop();

    if (Player.currentPlayer === this) {
      Player.currentPlayer = null;
    }
  }

  // Controle da timeline
  seek(event: Event) {
    const input = event.target as HTMLInputElement;

    this.audio.currentTime = Number(input.value);
    this.currentTime = this.audio.currentTime;

    this.cdr.detectChanges();
  }

  // Formata tempo
  formatTime(time: number): string {
    if (!time || isNaN(time)) return '0:00';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}