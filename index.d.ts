import * as crypto from "crypto";

const hash256 = (data: string): string => {
  const hash = crypto.createHash("sha256");
  const hashedData = hash.update(data, "utf-8").digest("hex");
  return hashedData;
};

const decToHex_8bit = (number: number): string => {
  let hex: string = number.toString(16);
  if (hex.length === 1) hex = "0" + hex;
  return hex;
};

const charToASCII_hex_8bit = (letter: string): string => {
  return decToHex_8bit(letter.charCodeAt(0));
};
const ASCIIhexToChar_8bit = (ASCII_hex: string): string => {
  return String.fromCharCode(parseInt(ASCII_hex, 16));
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

export const encryption = (text: string, key: string = "") => {
  const initBlockHash: string = hash256(key);
  let textHex: string = text
    .split("")
    .map((i) => charToASCII_hex_8bit(i))
    .join("");
  const partTextHex: string[] = partition_64(textHex);
  let partTextHash: string[] = partTextHex.map((item) => hash256(item));
  let blockHash: string[] = [initBlockHash, ...partTextHash].slice(
    0,
    partTextHash.length
  );
  blockHash[blockHash.length - 1] = blockHash[blockHash.length - 1].slice(
    0,
    partTextHex[partTextHex.length - 1].length
  );
  let blockHex: string[] = partTextHex;
  let encrypted: string = "";
  for (let i = 0; i < blockHex.length; i++) {
    encrypted += blockHex[i]
      .split("")
      .map((item, index) => forwardBitwise_hex(item, blockHash[i][index]))
      .join("");
  }
  return encrypted;
};

export const decryption = (text: string, key: string = "") => {
  let initHash: string = hash256(key);
  const partHash: string[] = partition_64(text);
  let back: string = "";
  for (let i = 0; i < partHash.length; i++) {
    initHash = partHash[i]
      .split("")
      .map((item, index) => backwardBitwise_hex(item, initHash[index]))
      .join("");
    back += initHash;
  }
  const partBack: string[] = partition_64(back, 2);
  const decrypted: string = partBack
    .map((item) => ASCIIhexToChar_8bit(item))
    .join("");
  return decrypted;
};
