/**
 * secureStorage
 * -------------
 * Encrypts JSON payloads with AES-GCM (Web Crypto API) before they are
 * written to localStorage, and decrypts them on read.
 *
 * Threat model note: this runs entirely client-side, so the encryption
 * key necessarily also lives in the browser (localStorage). This does
 * NOT protect the data from someone with access to the same browser
 * profile/devtools — that is not achievable client-side. What it DOES
 * protect against is the data being readable as plain text by:
 *  - anything that just skims localStorage values (browser extensions,
 *    casual inspection, non-JS tooling reading the LDB file),
 *  - accidental exposure (screenshots of devtools "Application" tab,
 *    support screen-shares, etc).
 * The key is generated once per browser and stored separately from the
 * ciphertext under its own key.
 */

const KEY_STORAGE_KEY = "zetheta:draft-key:v1";

async function getOrCreateKey() {
  const existing = window.localStorage.getItem(KEY_STORAGE_KEY);

  if (existing) {
    const raw = base64ToBytes(existing);
    return window.crypto.subtle.importKey(
      "raw",
      raw,
      { name: "AES-GCM" },
      true,
      ["encrypt", "decrypt"]
    );
  }

  const key = await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  const exported = await window.crypto.subtle.exportKey("raw", key);
  window.localStorage.setItem(
    KEY_STORAGE_KEY,
    bytesToBase64(new Uint8Array(exported))
  );

  return key;
}

function bytesToBase64(bytes) {
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return window.btoa(binary);
}

function base64ToBytes(base64) {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function encryptToStorage(storageKey, data) {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    // Environments without Web Crypto (very old browsers / SSR) simply
    // don't get persistence rather than silently storing plaintext.
    return false;
  }

  try {
    const key = await getOrCreateKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(data));

    const ciphertext = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encoded
    );

    const payload = {
      iv: bytesToBase64(iv),
      data: bytesToBase64(new Uint8Array(ciphertext)),
    };

    window.localStorage.setItem(storageKey, JSON.stringify(payload));
    return true;
  } catch (error) {
    console.error("secureStorage: failed to encrypt/save draft", error);
    return false;
  }
}

export async function decryptFromStorage(storageKey) {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    return null;
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return null;

  try {
    const { iv, data } = JSON.parse(raw);
    const key = await getOrCreateKey();

    const plaintext = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: base64ToBytes(iv) },
      key,
      base64ToBytes(data)
    );

    return JSON.parse(new TextDecoder().decode(plaintext));
  } catch (error) {
    // Corrupted draft (bad JSON, wrong key, tampered ciphertext, etc.)
    console.error("secureStorage: failed to decrypt draft, discarding it", error);
    window.localStorage.removeItem(storageKey);
    return null;
  }
}

export function removeFromStorage(storageKey) {
  window.localStorage.removeItem(storageKey);
}
