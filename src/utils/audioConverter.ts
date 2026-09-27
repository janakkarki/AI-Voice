// @ts-ignore
import lamejs from 'lamejs';

/**
 * Converts a WAV ArrayBuffer (or 16-bit PCM buffer at 24000Hz mono) to an MP3 Blob
 */
export function wavToMp3Blob(wavArrayBuffer: ArrayBuffer): Blob {
  const dataView = new DataView(wavArrayBuffer);

  // Check RIFF header
  let sampleRate = 24000;
  let channels = 1;
  let dataOffset = 44;

  if (
    wavArrayBuffer.byteLength > 44 &&
    dataView.getUint8(0) === 0x52 && // 'R'
    dataView.getUint8(1) === 0x49 && // 'I'
    dataView.getUint8(2) === 0x46 && // 'F'
    dataView.getUint8(3) === 0x46    // 'F'
  ) {
    channels = dataView.getUint16(22, true);
    sampleRate = dataView.getUint32(24, true);

    // Find 'data' chunk
    let offset = 12;
    while (offset < wavArrayBuffer.byteLength - 8) {
      const chunkId = String.fromCharCode(
        dataView.getUint8(offset),
        dataView.getUint8(offset + 1),
        dataView.getUint8(offset + 2),
        dataView.getUint8(offset + 3)
      );
      const chunkSize = dataView.getUint32(offset + 4, true);
      if (chunkId === 'data') {
        dataOffset = offset + 8;
        break;
      }
      offset += 8 + chunkSize;
    }
  } else {
    dataOffset = 0;
  }

  // Extract 16-bit PCM samples
  const pcmLength = Math.floor((wavArrayBuffer.byteLength - dataOffset) / 2);
  const samples = new Int16Array(pcmLength);
  for (let i = 0; i < pcmLength; i++) {
    samples[i] = dataView.getInt16(dataOffset + i * 2, true);
  }

  // Initialize Lame MP3 Encoder (mono, sampleRate, 128kbps)
  const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128);
  const mp3Data: Uint8Array[] = [];

  const sampleBlockSize = 1152;
  for (let i = 0; i < samples.length; i += sampleBlockSize) {
    const sampleChunk = samples.subarray(i, i + sampleBlockSize);
    let mp3buf: Int8Array;
    if (channels === 1) {
      mp3buf = mp3encoder.encodeBuffer(sampleChunk);
    } else {
      mp3buf = mp3encoder.encodeBuffer(sampleChunk, sampleChunk);
    }
    if (mp3buf.length > 0) {
      mp3Data.push(new Uint8Array(mp3buf.buffer, mp3buf.byteOffset, mp3buf.length));
    }
  }

  const mp3End = mp3encoder.flush();
  if (mp3End.length > 0) {
    mp3Data.push(new Uint8Array(mp3End.buffer, mp3End.byteOffset, mp3End.length));
  }

  return new Blob(mp3Data as unknown as BlobPart[], { type: 'audio/mp3' });
}

/**
 * Converts a base64 WAV data URL (e.g. data:audio/wav;base64,...) to an MP3 data URL or triggers download
 */
export async function downloadAsMp3(base64WavDataUrl: string, filename: string): Promise<void> {
  const base64Data = base64WavDataUrl.split(',')[1] || base64WavDataUrl;
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const mp3Blob = wavToMp3Blob(bytes.buffer);
  const url = URL.createObjectURL(mp3Blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.mp3') ? filename : `${filename}.mp3`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
