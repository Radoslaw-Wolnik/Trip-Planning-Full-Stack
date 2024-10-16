import nodemailer from 'nodemailer';
import { sendEmail } from '../../../src/services/email.service';
import environment from '../../../src/config/environment';

jest.mock('nodemailer');

describe('Email Service', () => {
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

  it('should create a transporter with correct config', () => {
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: environment.email.host,
      port: environment.email.port,
      auth: {
        user: environment.email.user,
        pass: environment.email.password,
      },
    });
  });

  it('should send an email successfully', async () => {
    const emailOptions = {
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email',
    };

    const result = await sendEmail(emailOptions);

    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: environment.email.from,
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