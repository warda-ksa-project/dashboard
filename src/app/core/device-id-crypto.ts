/**
 * Browser device fingerprint + AES-256-CBC encrypted deviceId for OTP auth.
 * Wire format: Base64(IV[16 bytes] + ciphertext), plaintext JSON { deviceId, ts } (ts = UTC unix seconds).
 */
export async function buildEncryptedDeviceId(secret: string): Promise<string> {
  const deviceId = await getBrowserFingerprint();
  const ts = Math.floor(Date.now() / 1000);
  const plaintext = JSON.stringify({ deviceId, ts });
  const key = await sha256Bytes(secret);
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const cryptoKey = await crypto.subtle.importKey('raw', key, { name: 'AES-CBC' }, false, ['encrypt']);
  const encoded = new TextEncoder().encode(plaintext);
  const cipher = await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, cryptoKey, encoded);
  const combined = new Uint8Array(iv.length + cipher.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(cipher), iv.length);
  return uint8ArrayToBase64(combined);
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const slice = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...slice);
  }
  return btoa(binary);
}

async function getBrowserFingerprint(): Promise<string> {
  const parts = [
    navigator.userAgent,
    navigator.language,
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    String(new Date().getTimezoneOffset()),
  ];
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(0, 0, 200, 50);
      ctx.fillStyle = '#069';
      ctx.fillText('warda-fp', 2, 15);
      parts.push(canvas.toDataURL());
    }
  } catch {
    /* ignore */
  }
  const raw = parts.join('|');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `web:${hex.slice(0, 32)}`;
}

async function sha256Bytes(text: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
}
