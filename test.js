const { encryption, decryption } = require(".");

// example 1: general text
console.log("Example 1");
const text = "Hello world 😎";
const key = "😆";
const numOfBitInBase16 = 6;
const encrypted = encryption(text, key, numOfBitInBase16);
console.log("encrypted", encrypted);
const decrypted = decryption(encrypted, key, numOfBitInBase16);
console.log("decrypted", decrypted);

// example 2: object
console.log("Example 2");
const objText = { name: "Geeleed", emo: "🥰" };
const objectString = JSON.stringify(objText);
const keyString = "ball";
const objEncrypted = encryption(objectString, keyString, numOfBitInBase16);
console.log("objEncrypted", objEncrypted);
const objDecrypted = decryption(objEncrypted, keyString, numOfBitInBase16);
console.log("objDecrypted", objDecrypted);
const objectData = JSON.parse(objDecrypted);
console.log("objectData", objectData);
