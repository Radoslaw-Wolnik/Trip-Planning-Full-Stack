import devLogger from './logger-dev.util';
import prodLogger from './logger-prod.util';

const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

export default logger;