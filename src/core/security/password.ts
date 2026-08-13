function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function createSalt(): string {
  const salt = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(salt);
  } else {
    salt.forEach((_, index) => {
      salt[index] = Math.floor(Math.random() * 256);
    });
  }
  return bytesToHex(salt);
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const value = `${salt}:${password}`;
  if (globalThis.crypto?.subtle) {
    const payload = new TextEncoder().encode(value);
    const digest = await globalThis.crypto.subtle.digest("SHA-256", payload);
    return bytesToHex(new Uint8Array(digest));
  }
  return sha256Fallback(value);
}

function rightRotate(value: number, amount: number): number {
  return (value >>> amount) | (value << (32 - amount));
}

function sha256Fallback(value: string): string {
  const maxWord = 2 ** 32;
  const hash: number[] = [];
  const constants: number[] = [];
  const composite: Record<number, boolean> = {};
  let primeIndex = 0;

  for (let candidate = 2; primeIndex < 64; candidate += 1) {
    if (!composite[candidate]) {
      for (let multiple = candidate * candidate; multiple < 400; multiple += candidate) {
        composite[multiple] = true;
      }
      hash[primeIndex] = (candidate ** 0.5 * maxWord) | 0;
      constants[primeIndex] = (candidate ** (1 / 3) * maxWord) | 0;
      primeIndex += 1;
    }
  }

  const bytes = Array.from(new TextEncoder().encode(value));
  const bitLength = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let index = 7; index >= 0; index -= 1) {
    bytes.push(Math.floor(bitLength / 2 ** (index * 8)) & 0xff);
  }

  for (let offset = 0; offset < bytes.length; offset += 64) {
    const words = new Array<number>(64).fill(0);
    for (let index = 0; index < 16; index += 1) {
      const byteOffset = offset + index * 4;
      words[index] =
        (bytes[byteOffset] << 24) |
        (bytes[byteOffset + 1] << 16) |
        (bytes[byteOffset + 2] << 8) |
        bytes[byteOffset + 3];
    }
    for (let index = 16; index < 64; index += 1) {
      const first = words[index - 15];
      const second = words[index - 2];
      const sigma0 = rightRotate(first, 7) ^ rightRotate(first, 18) ^ (first >>> 3);
      const sigma1 = rightRotate(second, 17) ^ rightRotate(second, 19) ^ (second >>> 10);
      words[index] = (words[index - 16] + sigma0 + words[index - 7] + sigma1) | 0;
    }

    const working = hash.slice(0, 8);
    for (let index = 0; index < 64; index += 1) {
      const sigma1 = rightRotate(working[4], 6) ^ rightRotate(working[4], 11) ^ rightRotate(working[4], 25);
      const choice = (working[4] & working[5]) ^ (~working[4] & working[6]);
      const temporary1 = (working[7] + sigma1 + choice + constants[index] + words[index]) | 0;
      const sigma0 = rightRotate(working[0], 2) ^ rightRotate(working[0], 13) ^ rightRotate(working[0], 22);
      const majority = (working[0] & working[1]) ^ (working[0] & working[2]) ^ (working[1] & working[2]);
      const temporary2 = (sigma0 + majority) | 0;
      working.unshift((temporary1 + temporary2) | 0);
      working[4] = (working[4] + temporary1) | 0;
      working.pop();
    }
    for (let index = 0; index < 8; index += 1) {
      hash[index] = (hash[index] + working[index]) | 0;
    }
  }

  return hash.map((word) => (word >>> 0).toString(16).padStart(8, "0")).join("");
}
