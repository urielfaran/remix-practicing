import { randomBytes } from "crypto";
import { decrypt, encrypt } from "js-crypto-aes";
import otplib from "otplib";
import QRCode from "qrcode";
import invariant from "tiny-invariant";

// encryption utils functions

/**
 * Converts a string to a Uint8Array.
 * @param str - The string to convert.
 */
function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

/**
 * Converts a Uint8Array to a string.
 * @param bytes - The Uint8Array to convert.
 */
function uint8ArrayToString(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}
/**
 * Converts a hexadecimal string to a Uint8Array.
 *
 * @param hex - A string representing hexadecimal bytes (e.g., 'a1b2c3').
 *
 * @returns {Uint8Array} A new `Uint8Array` containing the byte values represented by the hexadecimal string.
 *
 * @throws {Error} Throws an error if the length of the input hexadecimal string is not even, which is invalid for byte conversion.
 *
 * This function processes a hexadecimal string, checks its length for validity,
 * splits the string into byte-sized chunks, and converts each chunk into an integer
 * to form a new `Uint8Array` representation of the bytes.
 */
function bytesToUint8Array(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) throw new Error("Invalid bytes string length");
  return new Uint8Array(
    hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
}
/**
 * Converts a Uint8Array to a hexadecimal string.
 *
 * @param uint8Array - A `Uint8Array` containing byte values.
 *
 * @returns {string} A string representing the bytes in hexadecimal format (e.g., 'a1b2c3').
 *
 * This function converts each byte of a `Uint8Array` into a two-character hexadecimal string,
 * then joins them together to form a single string that represents the byte array in hexadecimal.
 */
function uint8ToBytes(uint8Array: Uint8Array): string {
  return Array.from(uint8Array, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}
/**
 * Generates an encrypted secret for two-factor authentication.
 *
 * This function creates a random initialization vector (IV), generates a
 * secret using the authenticator module, and encrypts the secret using the
 * provided key with the AES-GCM algorithm. It returns the plain secret, the
 * encrypted secret as a byte array, and the IV used for encryption.
 *
 * @param key - A `Uint8Array` representing the encryption key. This key is used
 *              to encrypt the generated secret.
 *
 * @returns A promise that resolves to an object containing:
 *   - `secret`: The generated plain text secret as a string.
 *   - `encryptedSecret`: The encrypted secret as a byte array.
 *   - `iv`: The initialization vector (IV) used during encryption as a `Uint8Array`.
 *
 * @throws Will throw an error if the encryption process fails.
 *
 * @example
 * ```typescript
 * import { randomBytes } from "crypto";
 *
 * const key = randomBytes(32); // Example 256-bit encryption key
 * const { secret, encryptedSecret, iv } = await generateEncryptedSecret(key);
 * console.log("Secret:", secret);
 * console.log("Encrypted Secret:", encryptedSecret);
 * console.log("IV:", iv);
 * ```
 */
export async function generateEncryptedSecret(key: Uint8Array) {
  const iv = randomBytes(12);
  const secret = otplib.authenticator.generateSecret(16);

  const encryptedSecret = await encrypt(stringToUint8Array(secret), key, {
    name: "AES-GCM",
    iv,
  });

  return { secret, encryptedSecret: uint8ToBytes(encryptedSecret), iv };
}
/**
 * Decodes and decrypts a previously encrypted secret.
 *
 * This function takes an encrypted secret, decodes it into a `Uint8Array`,
 * decrypts it using the provided encryption key and initialization vector (IV),
 * and then converts the decrypted secret back into a string.
 *
 * @param secret - A string representing the encrypted secret. This should be
 *                 the result of a prior encryption process.
 * @param key - A `Uint8Array` representing the encryption key. This key is used
 *              to decrypt the secret.
 * @param iv - A `Uint8Array` representing the initialization vector (IV) that
 *             was used during encryption. This ensures proper decryption.
 *
 * @returns A promise that resolves to the decrypted secret as a string.
 *
 * @throws Will throw an error if decryption fails due to an invalid key, IV,
 *         or corrupted input data.
 *
 * @example
 * ```typescript
 * import { randomBytes } from "crypto";
 *
 * const key = randomBytes(32); // Example 256-bit encryption key
 * const iv = randomBytes(12); // Example 12-byte IV
 * const encryptedSecret = "encrypted-secret-data"; // Encrypted secret string
 *
 * const decryptedSecret = await getDecodedDecryptedSecret(encryptedSecret, key, iv);
 * console.log("Decrypted Secret:", decryptedSecret);
 * ```
 */
export async function getDecodedDecryptedSecret(
  secret: string,
  key: Uint8Array,
  iv: Uint8Array
) {
  const decryptedSecret = await decrypt(bytesToUint8Array(secret), key, {
    name: "AES-GCM",
    iv,
  });

  return uint8ArrayToString(decryptedSecret);
}

export async function getQrCode(secret: string, iv: Uint8Array, username: string) {
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
  invariant(ENCRYPTION_KEY);
  const key = Uint8Array.from(Buffer.from(ENCRYPTION_KEY, "hex"));

  const decodedDecryptedSecret = await getDecodedDecryptedSecret(
    secret,
    key,
    iv
  );
  const service = process.env.TWOFA_SERVICE_NAME;
  invariant(service, "TWOFA_SERVICE_NAME is not set in the configuration");
  const otpauth = otplib.authenticator.keyuri(
    username,
    service,
    decodedDecryptedSecret
  );

  const qrCode = await QRCode.toDataURL(otpauth || "");
  return qrCode;
}