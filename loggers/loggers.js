const { createLogger, format, transports } = require('winston');


const appLogger = createLogger({
   level: 'info',
   format: format.combine(
      format.label({ label: 'entry' }),
      format.timestamp(),
      // format.json()
      format.prettyPrint()
   ),
   transports: [ 
      new transports.Console(),
      new transports.File({ filename: 'logs/bodies.log'}) 
   ]
});

module.exports = {
   logBody: function(req, res, next) {
      if (req.body && Object.keys(req.body).length) 
         appLogger.info(JSON.stringify(req.body));
      next();
   }
};
