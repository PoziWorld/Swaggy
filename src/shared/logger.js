import { createLogger, format, transports } from 'winston';

import t from 'Shared/i18n';

const { combine, printf, splat, simple } = format;

const logger = createLogger( {
  format: combine(
    splat(),
    simple(),
    printf( info => `${ t( `extensionName` ) }: ${ info.level }: ${ info.message }` ),
  ),
  transports: [
    new transports.Console( {
      level: process.env.NODE_ENV === 'development' ? 'silly' : 'info',
      handleExceptions: true,
    } ),
  ],
} );

export default logger;
