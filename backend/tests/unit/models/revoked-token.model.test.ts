import mongoose from 'mongoose';
import RevokedToken from '../../../src/models/revoked-token.model';

describe('RevokedToken Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await RevokedToken.deleteMany({});
  });

  it('should create a new revoked token successfully', async () => {
    const tokenData = {
      token: 'testtoken123',
      expiresAt: new Date(),
    };

    const revokedToken = new RevokedToken(tokenData);
    await revokedToken.save();

    expect(revokedToken._id).toBeDefined();
    expect(revokedToken.token).toBe(tokenData.token);
    expect(revokedToken.expiresAt).toEqual(tokenData.expiresAt);
  });

  it('should require token and expiresAt', async () => {
    const revokedToken = new RevokedToken({});
    let error;

    try {
      await revokedToken.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.token).toBeDefined();
    expect(error.errors.expiresAt).toBeDefined();
  });

  it('should not allow duplicate tokens', async () => {
    const tokenData = {
      token: 'testtoken123',
      expiresAt: new Date(),
    };

    await new RevokedToken(tokenData).save();
    
    const duplicateToken = new RevokedToken(tokenData);
    let error;

    try {
      await duplicateToken.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(mongoose.Error.MongoServerError);
    expect(error.code).toBe(11000);
  });

  it('should delete expired tokens', async () => {
    const pastDate = new Date(Date.now() - 1000 * 60 * 60); // 1 hour ago
    const futureDate = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now

    await RevokedToken.create([
      { token: 'expiredtoken1', expiresAt: pastDate },
      { token: 'expiredtoken2', expiresAt: pastDate },
      { token: 'validtoken', expiresAt: futureDate },
    ]);

    await RevokedToken.deleteMany({ expiresAt: { $lt: new Date() } });

    const remainingTokens = await RevokedToken.find({});
    expect(remainingTokens).toHaveLength(1);
    expect(remainingTokens[0].token).toBe('validtoken');
  });
});