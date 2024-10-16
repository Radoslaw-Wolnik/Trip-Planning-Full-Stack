import mongoose from 'mongoose';
import User, { IUserDocument } from '../../../src/models/user.model';
import bcrypt from 'bcrypt';

describe('User Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should create a new user successfully', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const user = new User(userData);
    await user.save();

    expect(user._id).toBeDefined();
    expect(user.username).toBe(userData.username);
    expect(user.email).toBe(userData.email);
    expect(user.password).not.toBe(userData.password);
    expect(user.isVerified).toBe(false);
  });

  it('should require username, email, and password', async () => {
    const user = new User({});
    let error;

    try {
      await user.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.username).toBeDefined();
    expect(error.errors.email).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });

  it('should not allow duplicate emails', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    await new User(userData).save();
    
    const duplicateUser = new User(userData);
    let error;

    try {
      await duplicateUser.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(mongoose.Error.MongoServerError);
    expect(error.code).toBe(11000);
  });

  it('should hash password before saving', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const user = new User(userData);
    await user.save();

    expect(user.password).not.toBe(userData.password);
    expect(await bcrypt.compare(userData.password, user.password)).toBe(true);
  });

  it('should correctly compare passwords', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const user = new User(userData);
    await user.save();

    expect(await user.comparePassword('password123')).toBe(true);
    expect(await user.comparePassword('wrongpassword')).toBe(false);
  });

  it('should update user fields correctly', async () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
    await user.save();

    user.username = 'updateduser';
    user.email = 'updated@example.com';
    await user.save();

    const updatedUser = await User.findById(user._id);
    expect(updatedUser?.username).toBe('updateduser');
    expect(updatedUser?.email).toBe('updated@example.com');
  });

  it('should delete user correctly', async () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });
    await user.save();

    await User.deleteOne({ _id: user._id });

    const deletedUser = await User.findById(user._id);
    expect(deletedUser).toBeNull();
  });
});