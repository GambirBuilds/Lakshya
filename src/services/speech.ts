// Web Speech API interface for Voice Task Creation

export type SpeechStatus = 'inactive' | 'listening' | 'processing' | 'unsupported' | 'error';

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
  };
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export class SpeechService {
  private recognition: SpeechRecognitionInstance | null = null;
  private isAvailable: boolean = false;

  constructor() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      this.isAvailable = true;
      try {
        this.recognition = new SpeechRec();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      } catch (e) {
        console.warn('SpeechRecognition failed to instantiate:', e);
        this.isAvailable = false;
      }
    }
  }

  public isSupported(): boolean {
    return this.isAvailable && !!this.recognition;
  }

  public listen(
    onResult: (transcript: string, isFinal: boolean) => void,
    onStatusChange: (status: SpeechStatus, errorMessage?: string) => void
  ): () => void {
    if (!this.isSupported() || !this.recognition) {
      onStatusChange('unsupported', 'Speech recognition is not supported in this browser environment.');
      return () => {};
    }

    try {
      this.recognition.onstart = () => {
        onStatusChange('listening');
      };

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = '';
        let isFinal = false;
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }
        onResult(transcript, isFinal);
      };

      this.recognition.onerror = (event: { error: string }) => {
        let msg = `Speech recognition error: ${event.error}`;
        if (event.error === 'not-allowed') {
          msg = 'Microphone permission was denied. Please allow microphone access.';
        } else if (event.error === 'no-speech') {
          msg = 'No speech was detected. Please try again.';
        }
        onStatusChange('error', msg);
      };

      this.recognition.onend = () => {
        onStatusChange('inactive');
      };

      this.recognition.start();

      return () => {
        try {
          this.recognition?.stop();
        } catch {
          // ignore
        }
      };
    } catch (err) {
      onStatusChange('error', (err as Error).message);
      return () => {};
    }
  }
}

export const speechService = new SpeechService();
