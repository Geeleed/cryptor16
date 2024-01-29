# cryptor16

Encrypt and decrypt text using the `@geeleed/cryptor16` library.

## Installation

Install the package from npm:

```bash
npm i @geeleed/cryptor16
```

Usage
To run tests, use the following command:

```bash
npm run test
```

Description
cryptor16 is a simple algorithm for encrypting and decrypting text using a key. This project is developed purely for hobby purposes.

Example

```bash
const cryptor16 = require('@geeleed/cryptor16');

const key = 'your-secret-key';
const text = 'Hello, World!';

const encryptedText = cryptor16.encrypt(text, key);
console.log('Encrypted:', encryptedText);

const decryptedText = cryptor16.decrypt(encryptedText, key);
console.log('Decrypted:', decryptedText);
```

Remember to replace 'your-secret-key' with your actual secret key.
