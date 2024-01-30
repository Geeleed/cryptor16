import * as crypto from "crypto";

const hash256 = (data: string): string => {
  const hash = crypto.createHash("sha256");
  const hashedData = hash.update(data, "utf-8").digest("hex");
  return hashedData;
};

const makeZero = (lengthOfZero: number) => {
  let zero = "";
  for (let i = 0; i < lengthOfZero; i++) zero += "0";
  return zero;
};

// numOfBitInBase16 max = 6.
const decToHex_32bit = (
  number: number,
  numOfBitInBase16: number = 6
): string => {
  let hex: string = number.toString(16);
  return makeZero(numOfBitInBase16 - hex.length) + hex;
};

const charToUnicodeHex_32bit = (
  letter: string,
  numOfBitInBase16: number = 6
): string => {
  return letter && decToHex_32bit(letter.codePointAt(0)!, numOfBitInBase16);
};

const unicodeHexToChar_32bit = (unicodeHex: string): string => {
  return unicodeHex && String.fromCodePoint(parseInt(unicodeHex, 16));
};

const partition_64 = (text: string, lenCut: number = 64): string[] => {
  const lenText: number = text.length;
  const numBlocks: number = Math.floor(lenText / lenCut) + 1;
  let result: string[] = [];
  for (let i = 0; i < numBlocks; i++) {
    result.push(
      i !== numBlocks - 1
        ? text.slice(lenCut * i, lenCut * (i + 1))
        : text.slice(lenCut * i, lenText)
    );
  }
  !result[result.length - 1] && result.pop();
  return result;
};

const forwardBitwise_hex = (
  inputHex: string,
  numOfBitwise_hex: string
): string => {
  const hexSet: string = "0123456789abcdef";
  const inputHex_dec: number = parseInt(inputHex, 16);
  const numOfBitwise_dec: number = parseInt(numOfBitwise_hex, 16);
  const result = hexSet[(inputHex_dec + numOfBitwise_dec) % 16];
  return result;
};

const backwardBitwise_hex = (
  inputHex: string,
  numOfBitwise_hex: string
): string => {
  const hexSet: string = "0123456789abcdef";
  const inputHex_dec: number = parseInt(inputHex, 16);
  const numOfBitwise_dec: number = parseInt(numOfBitwise_hex, 16);
  const target: number = (inputHex_dec - numOfBitwise_dec) % 16;
  const result: string = target < 0 ? hexSet[16 + target] : hexSet[target];
  return result;
};

export const encryption = (
  text: string,
  key: string = "",
  numOfBitInBase16: number = 6
): string => {
  const initBlockHash: string = hash256(key);
  let textHex: string = text
    .split("")
    .map((i) => charToUnicodeHex_32bit(i, numOfBitInBase16))
    .join("");
  const textHexLength = textHex.length;
  const partTextHex: string[] = partition_64(textHex, 64);
  let partTextHash: string[] = partTextHex.map((item) => hash256(item));
  const combinedHash: string = [initBlockHash, ...partTextHash]
    .join("")
    .slice(0, textHexLength);
  const encrypted = textHex
    .split("")
    .map((i, index) => forwardBitwise_hex(i, combinedHash[index]))
    .join("");
  return encrypted;
};

export const decryption = (
  text: string,
  key: string = "",
  numOfBitInBase16: number = 6
): string => {
  let initHash: string = hash256(key);
  const partHash: string[] = partition_64(text, 64);
  let back: string = "";
  for (let i = 0; i < partHash.length; i++) {
    let temp: string = partHash[i]
      .split("")
      .map((item, index) => backwardBitwise_hex(item, initHash[index]))
      .join("");
    back += temp;
    initHash = hash256(temp);
  }
  const partBack: string[] = partition_64(back, numOfBitInBase16);
  const decrypted: string = partBack
    .map((item) => unicodeHexToChar_32bit(item))
    .join("");
  return decrypted;
};
