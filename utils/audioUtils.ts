// Helper functions for audio decoding and encoding

/**
 * Decodes a base64 string into a Uint8Array.
 * @param base64 The base64 encoded string.
 * @returns A Uint8Array containing the decoded binary data.
 */
export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decodes raw PCM audio data into an AudioBuffer for playback.
 * @param data The raw audio data as a Uint8Array.
 * @param ctx The AudioContext to use for decoding.
 * @returns A promise that resolves to an AudioBuffer.
 */
export async function decodePcmAudioData(
  data: Uint8Array,
  ctx: AudioContext,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length;
  // Gemini TTS sample rate is 24000, and it's single channel (mono)
  const buffer = ctx.createBuffer(1, frameCount, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}

/**
 * Creates a WAV file Blob from base64 encoded PCM audio data.
 * This function constructs a valid 44-byte WAV header and prepends it to the raw audio data.
 * @param base64Pcm The base64 encoded string of raw PCM audio data.
 * @returns A Blob representing the complete WAV file.
 */
export function createWavBlobFromBase64(base64Pcm: string): Blob {
    const pcmData = decode(base64Pcm);
    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    
    const header = new ArrayBuffer(44);
    const view = new DataView(header);
    
    // RIFF chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + pcmData.length, true);
    writeString(view, 8, 'WAVE');
    
    // "fmt " sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // Sub-chunk size
    view.setUint16(20, 1, true); // Audio format (1 for PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true); // Byte rate
    view.setUint16(32, numChannels * (bitsPerSample / 8), true); // Block align
    view.setUint16(34, bitsPerSample, true);
    
    // "data" sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, pcmData.length, true);
    
    return new Blob([header, pcmData], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}
