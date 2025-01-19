import crypto from 'crypto';

export class DNAEncryption {
  private key: Buffer;
  
  constructor(secretKey: string) {
    this.key = crypto.createHash('sha256').update(secretKey).digest();
  }

  async encrypt(data: Buffer): Promise<{ encryptedData: Buffer; iv: string }> {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.key, iv);
    
    const encryptedData = Buffer.concat([
      cipher.update(data),
      cipher.final()
    ]);

    const combinedData = Buffer.concat([iv, encryptedData]);

    return {
      encryptedData: combinedData,
      iv: iv.toString('hex')
    };
  }

  async decrypt(encryptedData: Buffer): Promise<Buffer> {
    const iv = encryptedData.slice(0, 16);
    const dataWithoutIV = encryptedData.slice(16);

    const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, iv);
    
    return Buffer.concat([
      decipher.update(dataWithoutIV),
      decipher.final()
    ]);
  }
}