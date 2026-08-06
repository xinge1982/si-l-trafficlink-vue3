import JSEncrypt from 'jsencrypt';

function Encrypt(text) {
    let jse = new JSEncrypt({ default_key_size: "2048" });
    jse.setPublicKey(
        `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlO9PYYC7TtnJLylhqyLmgh
ZEz1X3sOwuLkpB/cDDHfJSALbOfXWo+bR2cqVj/ZZLObjF5EjW8O22g0dBQiszvA/DDlqgT
LNM4zP8KiQE+isY0DDtNBJrKQKq/07oGUwrp2w1nULC/2hmsqnmY/Co+apj8foOqvZ3jyVT
WPNTyRlgFGGiT1ZtJ4Cwo0jUN523aXnv7xcqj/E2woXYEHKH4WdFs/zHOkJmocnqM4SPtFm
kAJ5iIsyKcAqUtIj0e9xJk3RawxSfqP7YA1TX1bG6zdPOOVFelDb3xjv0wrInjF/C96Agrk
GjKVIJfO7kKOCTVK6cNrf+/2g0jo49km8m3wIDAQAB`
    );
    let encrypted = jse.encrypt(text);
    if (encrypted === false) {
        throw new Error('RSA encryption failed.')
    }
    return encrypted;
}
export default {
    Encrypt,
}