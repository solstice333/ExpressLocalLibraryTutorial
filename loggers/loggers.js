const winston = require('winston');

const appLogger = winston.createLogger({
   level: 'info',
   format: winston.format.combine(
      winston.format.label({ label: 'entry' }),
      winston.format.timestamp(),
      // winston.format.json()
      winston.format.prettyPrint()
   ),
   transports: [ 
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'logs/bodies.log'}) 
   ]
});

module.exports = {
   logBody: function(req, res, next) {
      if (req.body && Object.keys(req.body).length) 
         appLogger.info(JSON.stringify(req.body));
      next();
   }
};
