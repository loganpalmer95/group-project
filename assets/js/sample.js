'use strict';

const yelp = require('yelp-fusion');

//API key//


const apiKey = '1NXxFl_tG9EWkcqTbTLvBb_lTa8TIDLQuN74mfFVi_79mCBaBDLecGZF3Y7w-Gx7wDVrqHbcA8EgcKCfktEd-7E6g-L3SjPCf4ABxfK6-mRWubofRghu5KFrqLkJYnYx';

const searchRequest = {
  term:'mcdonald',
  location: 'orlando, fl'
};

const client = yelp.client(apiKey);

client.search(searchRequest).then(response => {
  const firstResult = response.jsonBody.businesses[0];
  const prettyJson = JSON.stringify(firstResult, null, 4);
  console.log(prettyJson);
}).catch(e => {
  console.log(e);
});