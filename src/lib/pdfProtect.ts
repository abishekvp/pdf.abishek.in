"use client";

const MAGIC_HEADER = "PDFENC1\0";

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as any,
      iterations: 100000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function protectPdf(
  file: File,
  password: string,
  onProgress?: (progress: number, status: string) => void
): Promise<Blob> {
  onProgress?.(20, "Loading document bytes...");
  const rawBytes = await file.arrayBuffer();

  onProgress?.(50, "Deriving AES-256 encryption key...");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);

  onProgress?.(80, "Encrypting document with AES-GCM...");
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    rawBytes
  );

  onProgress?.(95, "Packaging encrypted document...");
  const headerBytes = new TextEncoder().encode(MAGIC_HEADER);
  const combined = new Uint8Array(
    headerBytes.length + salt.length + iv.length + encryptedBuffer.byteLength
  );

  let offset = 0;
  combined.set(headerBytes, offset);
  offset += headerBytes.length;

  combined.set(salt, offset);
  offset += salt.length;

  combined.set(iv, offset);
  offset += iv.length;

  combined.set(new Uint8Array(encryptedBuffer), offset);

  onProgress?.(100, "Done!");
  return new Blob([combined.buffer as ArrayBuffer], { type: "application/pdf" });
}

export async function unlockPdf(
  file: File,
  password: string,
  onProgress?: (progress: number, status: string) => void
): Promise<Blob> {
  onProgress?.(20, "Reading protected file...");
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const headerBytes = new TextEncoder().encode(MAGIC_HEADER);
  // Check magic header
  for (let i = 0; i < headerBytes.length; i++) {
    if (bytes[i] !== headerBytes[i]) {
      // If it's not a vault file, notify user
      throw new Error("This file does not have recognized AES-256 vault protection, or is already unencrypted.");
    }
  }

  let offset = headerBytes.length;
  const salt = bytes.slice(offset, offset + 16);
  offset += 16;

  const iv = bytes.slice(offset, offset + 12);
  offset += 12;

  const ciphertext = bytes.slice(offset);

  onProgress?.(50, "Deriving decryption key...");
  const key = await deriveKey(password, salt);

  onProgress?.(80, "Decrypting content...");
  let decrypted: ArrayBuffer;
  try {
    decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext
    );
  } catch (err) {
    throw new Error("Incorrect password. Unable to decrypt document.");
  }

  onProgress?.(100, "Done!");
  return new Blob([decrypted], { type: "application/pdf" });
}
