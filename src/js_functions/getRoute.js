//Loading Fishing Info
const path = require('path');
const fullPath = path.resolve("./fishing_info.json");
const fishing_data = require(fullPath);

//function to calculate route and time
function getRoute(date) {
  // Get the number of voyages since 00:00:00 UTC, 1 January 1970
  const voyageNumber = Math.floor(date.getTime() / 7200000);

  // Get where it lies in the pattern
  const route =
    fishing_data.Pattern[(88 + voyageNumber) % fishing_data.Pattern.length];

  return [fishing_data.RouteList[route[0]], fishing_data.Time[route[1]]];
}

module.exports = getRoute;