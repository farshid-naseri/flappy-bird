export function generateSilentAudioBuffer(context: AudioContext, duration = 0.1): AudioBuffer {
  const sampleRate = context.sampleRate;
  const buffer = context.createBuffer(1, sampleRate * duration, sampleRate);
  return buffer;
}

export function createMockAudioUrl(name: string): string {
  return `data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=`;
}
