import { sendEmail } from '../../../src/services/email.service';
import nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('Email Service Integration Tests', () => {
  let mockTransporter: any;

  beforeEach(() => {
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'mock-message-id' }),
    };
    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send an email successfully', async () => {
    const emailOptions = {
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email',
    };

    const result = await sendEmail(emailOptions);

    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: expect.any(String),
      ...emailOptions,
    });
    expect(result).toEqual({ messageId: 'mock-message-id' });
  });

  it('should throw an error if sending fails', async () => {
    const error = new Error('Sending failed');
    mockTransporter.sendMail.mockRejectedValue(error);

    const emailOptions = {
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email',
    };

    await expect(sendEmail(emailOptions)).rejects.toThrow('Sending failed');
  });
});