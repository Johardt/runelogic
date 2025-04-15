"use client";

// Function to convert UUID to encryption key bytes
const uuidToKey = (uuid: string): Uint8Array => {
  // Remove dashes and convert to bytes
  const hex = uuid.replace(/-/g, '');
  const bytes = new Uint8Array(32); // We need 32 bytes for AES-256
  
  // Repeat the UUID bytes to fill the 32-byte key
  for (let i = 0; i < 32; i++) {
    bytes[i] = parseInt(hex.slice((i % 16) * 2, (i % 16) * 2 + 2), 16);
  }
  
  return bytes;
};

export const encrypt = async (data: string, userKey: string): Promise<string> => {
  try {
    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Import the key
    const key = await crypto.subtle.importKey(
      "raw",
      uuidToKey(userKey),
      { name: "AES-GCM" },
      false,
      ["encrypt"]
    );

    // Convert the string to bytes
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);

    // Encrypt the data
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      dataBytes
    );

    // Combine IV + encrypted data and convert to base64
    const combined = new Uint8Array(iv.length + new Uint8Array(encryptedData).length);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);

    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
};

export const decrypt = async (encryptedData: string, userKey: string): Promise<string> => {
  try {
    // Convert base64 to bytes
    const combined = new Uint8Array(
      atob(encryptedData)
        .split('')
        .map(char => char.charCodeAt(0))
    );

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    // Import the key
    const key = await crypto.subtle.importKey(
      "raw",
      uuidToKey(userKey),
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );

    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      data
    );

    // Convert the decrypted bytes back to a string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};
