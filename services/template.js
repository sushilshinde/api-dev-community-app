require("moment-timezone");
const prettyMilliseconds = require('pretty-ms');
const axios = require("axios");
const moment = require("moment");
require("dotenv").config();

exports.getReleases = async () => {
  let data = null;
  try {
    //try to get data
    const response = await axios.get(`https://circleci.com/api/v1.1/project/github/${process.env.user}/${process.env.project}?circle-token=${process.env.CCItoken}&limit=99`);
    data = response.data;
    //console.log(data)
    
  } catch (e) {
    console.error(e)
  }
  return buildResponse(data);
};

function buildResponse(p) {
   
   
    return latest;
  }



