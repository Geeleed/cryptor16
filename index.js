"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryption = exports.encryption = void 0;
var crypto = require("crypto");
var hash256 = function (data) {
    var hash = crypto.createHash("sha256");
    var hashedData = hash.update(data, "utf-8").digest("hex");
    return hashedData;
};
var makeZero = function (lengthOfZero) {
    var zero = "";
    for (var i = 0; i < lengthOfZero; i++)
        zero += "0";
    return zero;
};
var decToHex_32bit = function (number) {
    var hex = number.toString(16);
    return makeZero(5 - hex.length) + hex;
};
var charToUnicodeHex_32bit = function (letter) {
    return letter && decToHex_32bit(letter.codePointAt(0));
};
var unicodeHexToChar_32bit = function (unicodeHex) {
    return unicodeHex && String.fromCodePoint(parseInt(unicodeHex, 16));
};
var partition_64 = function (text, lenCut) {
    if (lenCut === void 0) { lenCut = 64; }
    var lenText = text.length;
    var numBlocks = Math.floor(lenText / lenCut) + 1;
    var result = [];
    for (var i = 0; i < numBlocks; i++) {
        result.push(i !== numBlocks - 1
            ? text.slice(lenCut * i, lenCut * (i + 1))
            : text.slice(lenCut * i, lenText));
    }
    !result[result.length - 1] && result.pop();
    return result;
};
var forwardBitwise_hex = function (inputHex, numOfBitwise_hex) {
    var hexSet = "0123456789abcdef";
    var inputHex_dec = parseInt(inputHex, 16);
    var numOfBitwise_dec = parseInt(numOfBitwise_hex, 16);
    var result = hexSet[(inputHex_dec + numOfBitwise_dec) % 16];
    return result;
};
var backwardBitwise_hex = function (inputHex, numOfBitwise_hex) {
    var hexSet = "0123456789abcdef";
    var inputHex_dec = parseInt(inputHex, 16);
    var numOfBitwise_dec = parseInt(numOfBitwise_hex, 16);
    var target = (inputHex_dec - numOfBitwise_dec) % 16;
    var result = target < 0 ? hexSet[16 + target] : hexSet[target];
    return result;
};
var encryption = function (text, key) {
    if (key === void 0) { key = ""; }
    var initBlockHash = hash256(key);
    var textHex = text
        .split("")
        .map(function (i) { return charToUnicodeHex_32bit(i); })
        .join("");
    var textHexLength = textHex.length;
    var partTextHex = partition_64(textHex, 64);
    var partTextHash = partTextHex.map(function (item) { return hash256(item); });
    var combinedHash = __spreadArray([initBlockHash], partTextHash, true).join("")
        .slice(0, textHexLength);
    var encrypted = textHex
        .split("")
        .map(function (i, index) { return forwardBitwise_hex(i, combinedHash[index]); })
        .join("");
    return encrypted;
};
exports.encryption = encryption;
var decryption = function (text, key) {
    if (key === void 0) { key = ""; }
    var initHash = hash256(key);
    var partHash = partition_64(text, 64);
    var back = "";
    for (var i = 0; i < partHash.length; i++) {
        var temp = partHash[i]
            .split("")
            .map(function (item, index) { return backwardBitwise_hex(item, initHash[index]); })
            .join("");
        back += temp;
        initHash = hash256(temp);
    }
    var partBack = partition_64(back, 5);
    var decrypted = partBack
        .map(function (item) { return unicodeHexToChar_32bit(item); })
        .join("");
    return decrypted;
};
exports.decryption = decryption;
