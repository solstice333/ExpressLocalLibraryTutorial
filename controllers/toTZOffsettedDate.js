function adjustDateWithTZOffset(date, tzoffset) {
   let pad = num => num < 10 ? '0' + num : num;
   let sign = tzoffset >= 0 ? '-' : '+';
   let hours = Math.floor(tzoffset/60);
   let mins = Math.floor(tzoffset%60);
   let iso = date.toISOString()
      .replace(/Z/, `${sign}${pad(hours)}:${pad(mins)}`);
   return new Date(iso);
}

function toTZOffsettedDate(date_str, { req }) {
   if (!date_str) return date_str;
   let tzoffset = parseInt(req.body.tzoffset)
   let date = new Date(date_str);
   return adjustDateWithTZOffset(date, tzoffset).toISOString();
}

module.exports = toTZOffsettedDate;
