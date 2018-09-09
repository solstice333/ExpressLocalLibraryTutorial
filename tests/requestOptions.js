const cheerio = require('cheerio');

function getRequestOptionsForUri(uri) {
   return {
      uri: uri,
      resolveWithFullResponse: true,
      transform: (body, resp, resolveWithFullResponse) => {
         if (resolveWithFullResponse) {
            resp.body = cheerio.load(resp.body);
            return resp;
         }
         else
            return cheerio.load(body);
      }
   };
}

module.exports = {
   getRequestOptionsForUri
};
