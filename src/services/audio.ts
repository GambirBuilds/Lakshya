// Web Audio API ambient sound generator & notification chimes
// 100% self-contained, zero external media dependencies, zero bandwidth, instant playback

export interface SoundTrack {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
}

export const SOUND_TRACKS: SoundTrack[] = [
  { id: 'deep-focus', name: 'Alpha Focus Wave', category: 'Deep Focus', description: '40Hz binaural waves for maximum cognitive flow', icon: 'Zap' },
  { id: 'rain', name: 'Rainfall on Leaves', category: 'Rain', description: 'Soothing continuous raindrops with low rumble', icon: 'CloudRain' },
  { id: 'ocean', name: 'Pacific Ocean Waves', category: 'Ocean', description: 'Rhythmic tidal swells and surf wash', icon: 'Waves' },
  { id: 'forest', name: 'Deep Whispering Forest', category: 'Forest', description: 'Gentle wind through pines with distant birds', icon: 'Trees' },
  { id: 'lo-fi', name: 'Lo-Fi Night Studio', category: 'Lo-fi', description: 'Mellow warm vinyl chords and steady cadence', icon: 'Headphones' },
  { id: 'coffee', name: 'Rainy Cafe Murmur', category: 'Coffee Shop', description: 'Cozy background hum and warm coffee shop ambiance', icon: 'Coffee' },
  { id: 'fireplace', name: 'Crackling Hearth', category: 'Fireplace', description: 'Warm timber embers with soothing crackles', icon: 'Flame' },
  { id: 'piano', name: 'Gentle Echoes Piano', category: 'Piano', description: 'Sparse ambient resonant harmonic chords', icon: 'Music' },
  { id: 'ambient', name: '432 Hz Healing Drone', category: 'Ambient', description: 'Deep harmonic sine wash tuned to natural resonance', icon: 'Radio' },
  { id: 'meditation', name: 'Tibetan Singing Bowl', category: 'Meditation', description: 'Pulsing overtone brass bowl ringing continuously', icon: 'Sparkles' },
  { id: 'space', name: 'Cosmic Nebula Sub', category: 'Space', description: 'Low frequency cosmic drone and stellar drift', icon: 'Compass' },
];

class AudioService {
  private ctx: AudioContext | null = null;
  private currentTrackId: string | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.5;
  private masterGain: GainNode | null = null;
  private activeNodes: Array<{ stop?: () => void; disconnect?: () => void }> = [];
  private intervalIds: number[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTrack(): string | null {
    return this.currentTrackId;
  }

  public stop() {
    this.intervalIds.forEach((id) => clearInterval(id));
    this.intervalIds = [];
    this.activeNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {
        // ignore already stopped
      }
    });
    this.activeNodes = [];
    this.isPlaying = false;
  }

  public playTrack(trackId: string) {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.currentTrackId = trackId;
    this.isPlaying = true;

    switch (trackId) {
      case 'rain':
        this.startRain();
        break;
      case 'ocean':
        this.startOcean();
        break;
      case 'forest':
        this.startForest();
        break;
      case 'fireplace':
        this.startFireplace();
        break;
      case 'ambient':
        this.startAmbient();
        break;
      case 'deep-focus':
        this.startDeepFocus();
        break;
      case 'space':
        this.startSpace();
        break;
      case 'meditation':
        this.startMeditation();
        break;
      case 'lo-fi':
        this.startLoFi();
        break;
      case 'coffee':
        this.startCoffeeShop();
        break;
      case 'piano':
        this.startPiano();
        break;
      default:
        this.startDeepFocus();
    }
  }

  // Noise buffer generator
  private createNoiseBuffer(duration = 5): AudioBuffer {
    const ctx = this.ctx!;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private startRain() {
    if (!this.ctx || !this.masterGain) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(4);
    noise.loop = true;

    // Filter into rain sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);
    noise.start();

    this.activeNodes.push(noise, filter, rainGain);

    // Random droplet pitter-patter
    const interval = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const dropGain = this.ctx.createGain();
      osc.type = 'sine';
      const freq = 1200 + Math.random() * 1800;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + 0.08);

      dropGain.gain.setValueAtTime(0.04 * Math.random(), this.ctx.currentTime);
      dropGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

      osc.connect(dropGain);
      dropGain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    }, 150);

    this.intervalIds.push(interval);
  }

  private startOcean() {
    if (!this.ctx || !this.masterGain) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(5);
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, this.ctx.currentTime);

    // LFO for wave swells
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // 8 second wave cycle
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(300, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const oceanGain = this.ctx.createGain();
    oceanGain.gain.setValueAtTime(0.6, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(oceanGain);
    oceanGain.connect(this.masterGain);

    noise.start();
    lfo.start();

    this.activeNodes.push(noise, filter, lfo, lfoGain, oceanGain);
  }

  private startForest() {
    if (!this.ctx || !this.masterGain) return;
    // Wind noise
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(4);
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(windGain);
    windGain.connect(this.masterGain);
    noise.start();

    this.activeNodes.push(noise, filter, windGain);

    // Occasional subtle bird chirps
    const interval = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      if (Math.random() > 0.4) return;
      const osc = this.ctx.createOscillator();
      const chirpGain = this.ctx.createGain();
      osc.type = 'sine';
      const baseFreq = 2400 + Math.random() * 800;
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(baseFreq + 600, this.ctx.currentTime + 0.1);
      osc.frequency.linearRampToValueAtTime(baseFreq + 200, this.ctx.currentTime + 0.2);

      chirpGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      chirpGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.25);

      osc.connect(chirpGain);
      chirpGain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
    }, 2500);

    this.intervalIds.push(interval);
  }

  private startFireplace() {
    if (!this.ctx || !this.masterGain) return;
    // Low rumble
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(3);
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, this.ctx.currentTime);

    const rumbleGain = this.ctx.createGain();
    rumbleGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(rumbleGain);
    rumbleGain.connect(this.masterGain);
    noise.start();

    this.activeNodes.push(noise, filter, rumbleGain);

    // Crackles and pops
    const interval = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      if (Math.random() > 0.65) return;
      const osc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400 + Math.random() * 800, this.ctx.currentTime);

      popGain.gain.setValueAtTime(0.06 + Math.random() * 0.05, this.ctx.currentTime);
      popGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(popGain);
      popGain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    }, 180);

    this.intervalIds.push(interval);
  }

  private startAmbient() {
    if (!this.ctx || !this.masterGain) return;
    // 432 Hz fundamental and harmonies
    const freqs = [432, 216, 648];
    freqs.forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx!.currentTime);

      // subtle vibrato
      const lfo = this.ctx!.createOscillator();
      lfo.frequency.setValueAtTime(0.2 + idx * 0.1, this.ctx!.currentTime);
      const lfoGain = this.ctx!.createGain();
      lfoGain.gain.setValueAtTime(1.5, this.ctx!.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      gain.gain.setValueAtTime((0.15 / (idx + 1)), this.ctx!.currentTime);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();

      this.activeNodes.push(osc, gain, lfo, lfoGain);
    });
  }

  private startDeepFocus() {
    if (!this.ctx || !this.masterGain) return;
    // Binaural beat: 200 Hz in left ear, 240 Hz in right ear = 40 Hz Gamma Focus
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(196, this.ctx.currentTime);
    osc2.frequency.setValueAtTime(236, this.ctx.currentTime);

    const gain1 = this.ctx.createGain();
    const gain2 = this.ctx.createGain();
    gain1.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain2.gain.setValueAtTime(0.12, this.ctx.currentTime);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(this.masterGain);
    gain2.connect(this.masterGain);

    osc1.start();
    osc2.start();

    // Warm pink noise underneath
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(5);
    noise.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, this.ctx.currentTime);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.15, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start();

    this.activeNodes.push(osc1, osc2, gain1, gain2, noise, filter, noiseGain);
  }

  private startSpace() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A1

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, this.ctx.currentTime);
    filter.Q.setValueAtTime(4, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(120, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    lfo.start();

    this.activeNodes.push(osc, filter, lfo, lfoGain, gain);
  }

  private startMeditation() {
    if (!this.ctx || !this.masterGain) return;
    const bowlFreqs = [261.63, 523.25, 784.88, 1046.5];
    bowlFreqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

      // Amplitude breathing
      const ampLfo = this.ctx!.createOscillator();
      ampLfo.frequency.setValueAtTime(0.15 + idx * 0.05, this.ctx!.currentTime);
      const ampLfoGain = this.ctx!.createGain();
      ampLfoGain.gain.setValueAtTime(0.03, this.ctx!.currentTime);

      ampLfo.connect(ampLfoGain);
      ampLfoGain.connect(gain.gain);

      gain.gain.setValueAtTime(0.08 / (idx + 1), this.ctx!.currentTime);
      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start();
      ampLfo.start();
      this.activeNodes.push(osc, gain, ampLfo, ampLfoGain);
    });
  }

  private startLoFi() {
    if (!this.ctx || !this.masterGain) return;
    // Vinyl subtle hiss
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(3);
    noise.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.8, this.ctx.currentTime);
    const hissGain = this.ctx.createGain();
    hissGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    noise.connect(filter);
    filter.connect(hissGain);
    hissGain.connect(this.masterGain);
    noise.start();

    this.activeNodes.push(noise, filter, hissGain);

    // Warm chord progression (Fmaj7 -> Em7 -> Dm7 -> Cmaj7)
    const chords = [
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [164.81, 196.00, 246.94, 293.66], // Em7
      [146.83, 174.61, 220.00, 261.63], // Dm7
      [130.81, 164.81, 196.00, 246.94], // Cmaj7
    ];
    let chordIdx = 0;

    const playChord = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const notes = chords[chordIdx];
      chordIdx = (chordIdx + 1) % chords.length;

      notes.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

        const chordFilter = this.ctx!.createBiquadFilter();
        chordFilter.type = 'lowpass';
        chordFilter.frequency.setValueAtTime(800, this.ctx!.currentTime);

        gain.gain.setValueAtTime(0.001, this.ctx!.currentTime);
        gain.gain.linearRampToValueAtTime(0.06, this.ctx!.currentTime + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx!.currentTime + 4.8);

        osc.connect(chordFilter);
        chordFilter.connect(gain);
        gain.connect(this.masterGain!);

        osc.start();
        osc.stop(this.ctx!.currentTime + 5.0);
      });
    };

    playChord();
    const interval = window.setInterval(playChord, 5000);
    this.intervalIds.push(interval);
  }

  private startCoffeeShop() {
    if (!this.ctx || !this.masterGain) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(4);
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const chatterGain = this.ctx.createGain();
    chatterGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(chatterGain);
    chatterGain.connect(this.masterGain);
    noise.start();

    this.activeNodes.push(noise, filter, chatterGain);

    // Cup clink
    const interval = window.setInterval(() => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      if (Math.random() > 0.4) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2200 + Math.random() * 1000, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    }, 3500);

    this.intervalIds.push(interval);
  }

  private startPiano() {
    if (!this.ctx || !this.masterGain) return;
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
    const playNote = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const freq = notes[Math.floor(Math.random() * notes.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(this.ctx.currentTime + 3.3);
    };

    playNote();
    const interval = window.setInterval(playNote, 2800);
    this.intervalIds.push(interval);
  }

  // System notification sounds
  public playChime(type: 'complete' | 'level_up' | 'task_done' | 'timer_tick' | 'bell') {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (type === 'task_done') {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    } else if (type === 'complete' || type === 'bell') {
      // Tibetan bell completion chime
      [523.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.15 / (idx + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + 2.5);
      });
    } else if (type === 'level_up') {
      // Fanfare arpeggio
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const noteStart = now + idx * 0.1;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);
        gain.gain.setValueAtTime(0.15, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(noteStart);
        osc.stop(noteStart + 0.65);
      });
    }
  }
}

export const audioService = new AudioService();
