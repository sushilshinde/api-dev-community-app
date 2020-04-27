require("dotenv").config();
const fs = require("fs");
require("moment-timezone");
const prettyMilliseconds = require("pretty-ms");
const axios = require("axios");
const moment = require("moment");
require("dotenv").config();
const { Octokit } = require('@octokit/rest')

const inputMonths = 6;



exports.getReleases = async () => {
  let data = null;
  try {
    //try to get data

    const octokit = new Octokit({
        auth: process.env.github_auth_token,
        baseUrl: "https://api.github.com",
      });

    const response = await octokit.repos.listReleases({
      owner: process.env.owner,
      repo: process.env.repo,
      per_page: 99,
    });

    //const response = await axios.get(`https://circleci.com/api/v1.1/project/github/${process.env.user}/${process.env.project}?circle-token=${process.env.CCItoken}&limit=99`);
    data = response.data;
  } catch (e) {
    console.error(e);
  }
  return buildResponse(data);
};

function buildResponse(data) {
  //console.log(data)
  const currentDate = new Date();
  let bugFixes = 0,
    newFeatures = 0,
    hotFixes = 0;
  currentDate.setMonth(currentDate.getMonth() - inputMonths);
  const newData = data.filter((release) => {      
      return new Date(release.published_at) > currentDate;
    }).map((release) => {
      if (release.name.toLocaleLowerCase().includes("Bug fix".toLocaleLowerCase())) {
        bugFixes++;
      }else if (release.name.toLocaleLowerCase().includes("New feature".toLocaleLowerCase())) {
        newFeatures++;
      } if (release.name.toLocaleLowerCase().includes("Hot fix".toLocaleLowerCase())) {
        hotFixes++;
      }
      return {
        tagName: release.tag_name,
        url: release.html_url,
        publishedAt: release.published_at,
        name: release.name,
      };
    });

  //const newData = data.
  //console.log(bugFixes,newFeatures,hotFixes)
  //console.log(newData)

  return {
    data: newData,
    metadata: {
        bugFixes: bugFixes,
        newFeatures: newFeatures,
        hotFixes: hotFixes,
    }
  };
}
