/**
 * FocusVerse Procedural Web Audio Engine
 * 100% Native Web Audio API - Zero External MP3s / Zero Broken Links.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  
  // Ambience nodes
  private ambienceSource: AudioNode | null = null;
  private ambienceGain: GainNode | null = null;
  private ambienceInterval: number | null = null;
  private currentAmbienceProfile: string | null = null;
  private ambienceVolume: number = 0.4;
  private isAmbiencePlaying: boolean = false;

  // Synth Arpeggiator nodes & timer
  private synthGain: GainNode | null = null;
  private synthInterval: number | null = null;
  private currentNotes: number[] = [261.63, 329.63, 392.00, 523.25];
  private synthVolume: number = 0.3;
  private isSynthPlaying: boolean = false;
  private noteIndex: number = 0;
  private synthWaveform: OscillatorType = 'triangle';

  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- AMBIENCE GENERATOR ---

  public setAmbienceProfile(profile: string) {
    this.currentAmbienceProfile = profile;
    if (this.isAmbiencePlaying) {
      this.stopAmbience();
      this.startAmbience(profile);
    }
  }

  public setAmbienceVolume(vol: number) {
    this.ambienceVolume = Math.max(0, Math.min(1, vol));
    if (this.ambienceGain && this.ctx) {
      this.ambienceGain.gain.setTargetAtTime(this.isMuted ? 0 : this.ambienceVolume, this.ctx.currentTime, 0.05);
    }
  }

  public toggleAmbience(profile: string = 'rain'): boolean {
    if (this.isAmbiencePlaying) {
      this.stopAmbience();
      return false;
    } else {
      this.startAmbience(profile);
      return true;
    }
  }

  public startAmbience(profile: string) {
    this.initContext();
    if (!this.ctx) return;
    this.stopAmbience();

    this.currentAmbienceProfile = profile;
    this.isAmbiencePlaying = true;

    this.ambienceGain = this.ctx.createGain();
    this.ambienceGain.gain.setValueAtTime(this.isMuted ? 0 : this.ambienceVolume, this.ctx.currentTime);
    this.ambienceGain.connect(this.ctx.destination);

    if (profile === 'rain' || profile === 'lofi') {
      this.generateRainNoise(profile === 'lofi');
    } else if (profile === 'fire') {
      this.generateFireCrackle();
    } else if (profile === 'space') {
      this.generateSpaceDrone();
    } else if (profile === 'purr') {
      this.generateCatPurr();
    } else if (profile === 'matrix') {
      this.generateMatrixStream();
    } else if (profile === 'sonar') {
      this.generateBatSonarEcho();
    } else {
      this.generateWindAmbient();
    }
  }

  public stopAmbience() {
    if (this.ambienceInterval) {
      clearInterval(this.ambienceInterval);
      this.ambienceInterval = null;
    }
    if (this.ambienceSource) {
      try {
        (this.ambienceSource as AudioScheduledSourceNode).stop?.();
        this.ambienceSource.disconnect();
      } catch (_) {}
      this.ambienceSource = null;
    }
    this.isAmbiencePlaying = false;
  }

  private generateRainNoise(isLofi: boolean) {
    if (!this.ctx || !this.ambienceGain) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    // Generate pinkish noise
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.1;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isLofi ? 800 : 1800, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.ambienceGain);
    whiteNoise.start();
    this.ambienceSource = whiteNoise;
  }

  private generateFireCrackle() {
    if (!this.ctx || !this.ambienceGain) return;
    
    // Background warm hum
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, this.ctx.currentTime);
    const lowGain = this.ctx.createGain();
    lowGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    osc.connect(lowGain);
    lowGain.connect(this.ambienceGain);
    osc.start();
    this.ambienceSource = osc;

    // Periodic crackle pops
    this.ambienceInterval = window.setInterval(() => {
      if (!this.ctx || !this.ambienceGain || !this.isAmbiencePlaying) return;
      if (Math.random() > 0.45) {
        const popOsc = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();
        popOsc.type = 'square';
        popOsc.frequency.setValueAtTime(150 + Math.random() * 450, this.ctx.currentTime);
        popGain.gain.setValueAtTime(0.04 * (0.5 + Math.random()), this.ctx.currentTime);
        popGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
        popOsc.connect(popGain);
        popGain.connect(this.ambienceGain);
        popOsc.start();
        popOsc.stop(this.ctx.currentTime + 0.05);
      }
    }, 120);
  }

  private generateSpaceDrone() {
    if (!this.ctx || !this.ambienceGain) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const sub = this.ctx.createOscillator();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(110, this.ctx.currentTime); // A2
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(164.81, this.ctx.currentTime); // E3
    sub.type = 'sine';
    sub.frequency.setValueAtTime(55, this.ctx.currentTime); // A1

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, this.ctx.currentTime);

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    sub.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(this.ambienceGain);

    osc1.start();
    osc2.start();
    sub.start();
    this.ambienceSource = osc1;
  }

  private generateCatPurr() {
    if (!this.ctx || !this.ambienceGain) return;
    const carrier = this.ctx.createOscillator();
    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(28, this.ctx.currentTime);

    const tremolo = this.ctx.createOscillator();
    tremolo.type = 'sine';
    tremolo.frequency.setValueAtTime(22, this.ctx.currentTime); // 22Hz purr pulse

    const tremGain = this.ctx.createGain();
    tremGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    tremolo.connect(tremGain.gain);

    carrier.connect(tremGain);
    tremGain.connect(this.ambienceGain);

    carrier.start();
    tremolo.start();
    this.ambienceSource = carrier;
  }

  private generateMatrixStream() {
    if (!this.ctx || !this.ambienceGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(65.4, this.ctx.currentTime); // C2

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.Q.setValueAtTime(5, this.ctx.currentTime);

    const baseGain = this.ctx.createGain();
    baseGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    osc.connect(filter);
    filter.connect(baseGain);
    baseGain.connect(this.ambienceGain);
    osc.start();
    this.ambienceSource = osc;

    // Digital bleeps
    this.ambienceInterval = window.setInterval(() => {
      if (!this.ctx || !this.ambienceGain || !this.isAmbiencePlaying) return;
      if (Math.random() > 0.5) {
        const bleep = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bleep.type = 'square';
        bleep.frequency.setValueAtTime(800 + Math.floor(Math.random() * 8) * 200, this.ctx.currentTime);
        bGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        bGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);
        bleep.connect(bGain);
        bGain.connect(this.ambienceGain);
        bleep.start();
        bleep.stop(this.ctx.currentTime + 0.09);
      }
    }, 200);
  }

  private generateBatSonarEcho() {
    if (!this.ctx || !this.ambienceGain) return;
    // Low subterranean drone
    const drone = this.ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.setValueAtTime(73.42, this.ctx.currentTime); // D2
    const dGain = this.ctx.createGain();
    dGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    drone.connect(dGain);
    dGain.connect(this.ambienceGain);
    drone.start();
    this.ambienceSource = drone;

    // Sonar Ping every 3 seconds
    this.ambienceInterval = window.setInterval(() => {
      if (!this.ctx || !this.ambienceGain || !this.isAmbiencePlaying) return;
      const ping = this.ctx.createOscillator();
      const pGain = this.ctx.createGain();
      ping.type = 'sine';
      ping.frequency.setValueAtTime(1480, this.ctx.currentTime);
      ping.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.35);
      pGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      pGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.45);
      ping.connect(pGain);
      pGain.connect(this.ambienceGain);
      ping.start();
      ping.stop(this.ctx.currentTime + 0.46);
    }, 2800);
  }

  private generateWindAmbient() {
    if (!this.ctx || !this.ambienceGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.ambienceGain);
    noise.start();
    this.ambienceSource = noise;
  }

  // --- 8-BIT CHIPTUNE / AMBIENT SYNTH ARPEGGIATOR ---

  public setSynthNotes(notes: number[]) {
    if (notes && notes.length > 0) {
      this.currentNotes = notes;
    }
  }

  public setSynthVolume(vol: number) {
    this.synthVolume = Math.max(0, Math.min(1, vol));
    if (this.synthGain && this.ctx) {
      this.synthGain.gain.setTargetAtTime(this.isMuted ? 0 : this.synthVolume, this.ctx.currentTime, 0.05);
    }
  }

  public setSynthWaveform(type: OscillatorType) {
    this.synthWaveform = type;
  }

  public toggleSynth(): boolean {
    if (this.isSynthPlaying) {
      this.stopSynth();
      return false;
    } else {
      this.startSynth();
      return true;
    }
  }

  public startSynth() {
    this.initContext();
    if (!this.ctx) return;
    this.stopSynth();

    this.isSynthPlaying = true;
    this.synthGain = this.ctx.createGain();
    this.synthGain.gain.setValueAtTime(this.isMuted ? 0 : this.synthVolume, this.ctx.currentTime);
    this.synthGain.connect(this.ctx.destination);

    this.noteIndex = 0;
    const tempoMs = 280; // Gentle arcade pulse tempo

    this.synthInterval = window.setInterval(() => {
      if (!this.ctx || !this.synthGain || !this.isSynthPlaying) return;
      const freq = this.currentNotes[this.noteIndex % this.currentNotes.length];
      this.noteIndex++;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = this.synthWaveform;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // ADSR Envelope
      const now = this.ctx.currentTime;
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.linearRampToValueAtTime(0.18, now + 0.03); // Attack
      noteGain.gain.exponentialRampToValueAtTime(0.06, now + 0.15); // Decay & Sustain
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26); // Release

      osc.connect(noteGain);
      noteGain.connect(this.synthGain);

      osc.start(now);
      osc.stop(now + 0.27);
    }, tempoMs);
  }

  public stopSynth() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.isSynthPlaying = false;
  }

  // --- MUTE TOGGLE ---

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ctx) {
      if (this.ambienceGain) {
        this.ambienceGain.gain.setValueAtTime(this.isMuted ? 0 : this.ambienceVolume, this.ctx.currentTime);
      }
      if (this.synthGain) {
        this.synthGain.gain.setValueAtTime(this.isMuted ? 0 : this.synthVolume, this.ctx.currentTime);
      }
    }
    return this.isMuted;
  }

  // --- SOUND EFFECTS ---

  public playClick() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(750, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.045);
  }

  public playTaskComplete() {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const freqs = [523.25, 659.25, 783.99]; // C5 - E5 - G5
    freqs.forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const start = this.ctx!.currentTime + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, start);
      gain.gain.setValueAtTime(0.12, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(start);
      osc.stop(start + 0.18);
    });
  }

  public playVictoryJingle(notes?: number[]) {
    this.initContext();
    if (!this.ctx || this.isMuted) return;
    const fanfare = notes && notes.length >= 4 
      ? notes 
      : [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];

    fanfare.forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const start = this.ctx!.currentTime + idx * 0.12;

      osc.type = 'square';
      osc.frequency.setValueAtTime(f, start);
      gain.gain.setValueAtTime(0.15, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + (idx === fanfare.length - 1 ? 0.6 : 0.22));

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(start);
      osc.stop(start + (idx === fanfare.length - 1 ? 0.65 : 0.25));
    });
  }

  public getState() {
    return {
      isAmbiencePlaying: this.isAmbiencePlaying,
      ambienceVolume: this.ambienceVolume,
      currentAmbienceProfile: this.currentAmbienceProfile,
      isSynthPlaying: this.isSynthPlaying,
      synthVolume: this.synthVolume,
      synthWaveform: this.synthWaveform,
      isMuted: this.isMuted,
    };
  }
}

export const audioEngine = new SoundEngine();
