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
var decToHex_8bit = function (number) {
    var hex = number.toString(16);
    if (hex.length === 1)
        hex = "0" + hex;
    return hex;
};
var charToASCII_hex_8bit = function (letter) {
    return decToHex_8bit(letter.charCodeAt(0));
};
var ASCIIhexToChar_8bit = function (ASCII_hex) {
    return String.fromCharCode(parseInt(ASCII_hex, 16));
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
        .map(function (i) { return charToASCII_hex_8bit(i); })
        .join("");
    var partTextHex = partition_64(textHex);
    var partTextHash = partTextHex.map(function (item) { return hash256(item); });
    var blockHash = __spreadArray([initBlockHash], partTextHash, true).slice(0, partTextHash.length);
    blockHash[blockHash.length - 1] = blockHash[blockHash.length - 1].slice(0, partTextHex[partTextHex.length - 1].length);
    var blockHex = partTextHex;
    var encrypted = "";
    var _loop_1 = function (i) {
        encrypted += blockHex[i]
            .split("")
            .map(function (item, index) { return forwardBitwise_hex(item, blockHash[i][index]); })
            .join("");
    };
    for (var i = 0; i < blockHex.length; i++) {
        _loop_1(i);
    }
    return encrypted;
};
exports.encryption = encryption;
var decryption = function (text, key) {
    if (key === void 0) { key = ""; }
    var initHash = hash256(key);
    var partHash = partition_64(text);
    var back = "";
    for (var i = 0; i < partHash.length; i++) {
        initHash = partHash[i]
            .split("")
            .map(function (item, index) { return backwardBitwise_hex(item, initHash[index]); })
            .join("");
        back += initHash;
    }
    var partBack = partition_64(back, 2);
    var decrypted = partBack
        .map(function (item) { return ASCIIhexToChar_8bit(item); })
        .join("");
    return decrypted;
};
exports.decryption = decryption;
