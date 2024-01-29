const { encryption, decryption } = require(".");

// example 1: general text
console.log("Example 1");
const text = "Hello world 😎";
const key = "😆";
const encrypted = encryption(text, key);
console.log("encrypted", encrypted);
const decrypted = decryption(encrypted, key);
console.log("decrypted", decrypted);

// example 2: object
console.log("Example 2");
const objText = { name: "Geeleed", emo: "🥰" };
const objectString = JSON.stringify(objText);
const keyString = "ball";
const objectEncrypted = encryption(objectString, keyString);
console.log("objectEncrypted", objectEncrypted);
const objectDecrypted = decryption(objectEncrypted, keyString);
console.log("objectDncrypted", objectDecrypted);
const objectData = JSON.parse(objectDecrypted);
console.log("objectData", objectData);
