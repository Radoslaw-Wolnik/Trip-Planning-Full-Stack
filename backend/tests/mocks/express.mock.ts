import { Request, Response } from 'express';
// import { AuthRequest } from '../../src/types/global';

export const mockRequest = (): Partial<Request> => ({
  body: {},
  params: {},
  query: {},
  cookies: {},
  headers: {},
});

export const mockAuthRequest = (): Partial<AuthRequest> => ({
  ...mockRequest(),
  user: undefined,
});

export const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.sendStatus = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
};