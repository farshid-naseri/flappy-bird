#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create a minimal valid WAV file (silent)
function createSilentWav(duration = 0.1, sampleRate = 44100) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const numSamples = Math.floor(sampleRate * duration);
  const dataSize = numSamples * numChannels * bytesPerSample;
  const fileSize = 36 + dataSize;

  const buffer = Buffer.alloc(44 + dataSize);
  
  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(fileSize, 4);
  buffer.write('WAVE', 8);
  
  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // fmt chunk size
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28); // byte rate
  buffer.writeUInt16LE(numChannels * bytesPerSample, 32); // block align
  buffer.writeUInt16LE(bitsPerSample, 34);
  
  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  
  // Silent audio data (all zeros)
  for (let i = 44; i < buffer.length; i++) {
    buffer[i] = 0;
  }
  
  return buffer;
}

const audioDir = path.join(__dirname, '../public/audio');

// Create directory if it doesn't exist
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Generate placeholder audio files
const files = [
  { name: 'bgm.wav', duration: 2.0 },
  { name: 'flap.wav', duration: 0.1 },
  { name: 'collision.wav', duration: 0.3 },
  { name: 'milestone.wav', duration: 0.2 },
];

files.forEach(({ name, duration }) => {
  const filePath = path.join(audioDir, name);
  const wavData = createSilentWav(duration);
  fs.writeFileSync(filePath, wavData);
  console.log(`Generated ${name} (${duration}s)`);
});

console.log('\nAll placeholder audio files generated successfully!');
console.log('Note: These are silent WAV files for testing. Replace with actual audio for production.');
