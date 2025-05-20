import crypto from 'crypto';
import {CommonConstants} from '../../constants';
import {APP} from '../app';
import {decrypt, encrypt} from './encryptionHandler';

jest.mock('crypto', () => ({
  createDecipheriv: jest.fn(),
  createCipheriv: jest.fn(),
  pbkdf2Sync: jest.fn(),
  randomBytes: jest.fn(),
}));

let key: Buffer | undefined;
APP.config.encryption = {
  algorithm: 'aes-256-cbc',
  salt: 'mockedSalt',
};

const createKey = () => {
  if (!key) {
    key = crypto.pbkdf2Sync(
      APP.config.encryption.salt,
      APP.config.encryption.salt,
      CommonConstants.iterations,
      CommonConstants.keyLength / 8,
      CommonConstants.SHA1,
    );
  }
};

describe('createKey', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    key = undefined; // Reset key before each test
  });

  test('should create a key if it does not exist', () => {
    createKey();
  });

  test('should not create a key if it already exists', () => {
    key = Buffer.from('existing_key');
    createKey();
    expect(key).toEqual(Buffer.from('existing_key'));
  });
});

describe('decrypt function', () => {
  const mockKey = Buffer.from('mockedKey');
  const mockIv = Buffer.from('mockediv');
  const mockEncryptedData = Buffer.from('mockedEncryptedData');
  const mockDecryptedData = Buffer.from('mockedDecryptedData');

  beforeAll(() => {
    // Mock the return value of pbkdf2Sync
    (crypto.pbkdf2Sync as jest.Mock).mockReturnValue(mockKey);
    (crypto.randomBytes as jest.Mock).mockReturnValue('randomBytes');

    // Mock the return value of createDecipheriv
    (crypto.createDecipheriv as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnValue(mockDecryptedData),
      final: jest.fn().mockReturnValue(Buffer.alloc(0)),
    });

    jest.mock('./encryptionHandler', () => ({
      ...jest.requireActual('./encryptionHandler'),
      createKey: jest.fn(),
    }));
  });

  it('should decrypt the encrypted text correctly', () => {
    const encryptedText =
      mockIv.toString('hex') + mockEncryptedData.toString('hex');
    const result = decrypt(encryptedText);
    expect(result).toBe(mockDecryptedData.toString());
  });
});

describe('encrypt', () => {
  const mockDecryptedData = Buffer.from('encryptedtext');
  const iv = Buffer.from('iv');
  beforeEach(() => {
    jest.mock('./encryptionHandler', () => ({
      ...jest.requireActual('./encryptionHandler'),
      createKey: jest.fn(),
    }));
    (crypto.randomBytes as jest.Mock).mockReturnValue(iv);
    (crypto.createCipheriv as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnValue(mockDecryptedData),
      final: jest.fn().mockReturnValue(Buffer.alloc(0)),
    });
  });

  describe('encrypt', () => {
    const mockDecryptedData = Buffer.from('encryptedtext');
    const iv = Buffer.from('iv');
    beforeEach(() => {
      jest.mock('./encryptionHandler', () => ({
        ...jest.requireActual('./encryptionHandler'),
        createKey: jest.fn(),
      }));
      (crypto.randomBytes as jest.Mock).mockReturnValue(iv);
      (crypto.createCipheriv as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnValue(mockDecryptedData),
        final: jest.fn().mockReturnValue(Buffer.alloc(0)),
      });
    });

    it('should encrypt the text correctly', () => {
      const text = 'plaintext';
      const encryptedBuffer = Buffer.from('encryptedtext');

      const result = encrypt(text);
      expect(result).toBe(iv.toString('hex') + encryptedBuffer.toString('hex'));
    });
  });
});
