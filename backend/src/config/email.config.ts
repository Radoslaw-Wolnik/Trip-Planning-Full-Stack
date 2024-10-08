export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
};

export const emailConfig: EmailConfig = {
  host: process.env.EMAIL_HOST || 'smtp-relay.brevo.com',
  port: process.env.EMAIL_PORT || 587,
  user: process.env.EMAIL_USER || '795ccf001@smtp-brevo.com',
  password: process.env.EMAIL_PASS || 'HPtac1DbV8wvsWZk',
  from: process.env.EMAIL_FROM || 'radoslaw.m.wolnik@gmail.com' // changed to radoslaw.m.wolnik@7953615.brevosend.com
  
  //EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
  //EMAIL_PORT: process.env.EMAIL_PORT || 2525,
  //EMAIL_USER: process.env.EMAIL_USER || 'your_mailtrap_username',
  //EMAIL_PASS: process.env.EMAIL_PASS || 'your_mailtrap_password',
  //EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@yourapp.com'
}