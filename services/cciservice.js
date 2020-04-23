require("moment-timezone");
const prettyMilliseconds = require('pretty-ms');
const axios = require("axios");
const moment = require("moment");
require("dotenv").config();
exports.getEnvironmentDeployments = async () => {
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
    const ENVS = [
      "build-dev",
      "build-prod-beta",
      "build-test",
      "build-qa",
      "build-prod"
    ];

    const ENV_DETAILS = {
      "build-dev":{name:"Developement","url":"https://community-app.topcoder.com/"},
      "build-prod-beta":{name:"Beta","url":"https://beta-community-app.topcoder.com/challenges"},
      "build-test":{name:"Test","url":"https://test-community-app.topcoder-dev.com/"},
      "build-qa":{name:"QA","url":"https://qa-community-app.topcoder-dev.com/"},
      "build-prod":{name:"Production","url":"https://community-app.topcoder.com/"},
    }
    let latest = [];
    let tracker = []
    
    for (i = 0; i < p.length; i++) {
      const ob = p[i];
      if (
        ob.workflows &&
        ob.workflows.job_name &&
        ENVS.indexOf(ob.workflows.job_name) >= 0 &&
        tracker.indexOf(ob.workflows.job_name) < 0 &&
        ob.status === "success"
      ) {

        const envName = ob.workflows.job_name.replace("build-", "")
        const details = ENV_DETAILS[""+ob.workflows.job_name+""]
        console.log(details)
        tracker.push(ob.workflows.job_name)
        latest.push(
            {
                env: details,
                branchDeployed: ob.branch,
                buildNumber: ob.build_num,
                buildStartedOn: moment(ob.start_time).tz("Asia/Kolkata").format("MMMM Do YYYY, h:mm:ss a"),
                buildStartedOnEDT: moment(ob.start_time).tz("America/New_York").format("MMMM Do YYYY, h:mm:ss a"),
                buildFinishedOn: moment(ob.stop_time).tz("Asia/Kolkata").format("MMMM Do YYYY, h:mm:ss a"),
                buildFinishedOnEDT: moment(ob.stop_time).tz("America/New_York").format("MMMM Do YYYY, h:mm:ss a"),
                authorName: ob.author_name,
                buildTimeMillis:prettyMilliseconds(ob.build_time_millis),
                body:ob.body,
                buildUrl:ob.build_url,
                committer_name:ob.committer_name,
                authorGitHubHandle:ob.user.login,
                jobStatus: ob.status
            }
        )
      }
      if (
        ob.workflows &&
        ob.workflows.job_name &&
        ENVS.indexOf(ob.workflows.job_name) >= 0 &&
        latest.indexOf(ob.workflows.job_name) < 0 &&
        ob.status === "running"
      ) {
        latest.push(
            {
                env: ob.workflows.job_name.replace("build-", ""),
                branchDeployed: ob.branch,
                buildNumber: ob.build_num,
                buildStartedOn: moment(ob.start_time).tz("Asia/Kolkata").format("MMMM Do YYYY, h:mm:ss a"),
                buildStartedOnEDT: moment(ob.start_time).tz("America/New_York").format("MMMM Do YYYY, h:mm:ss a"),
                buildFinishedOn: null,
                buildFinishedOnEDT: null,
                authorName: ob.author_name,
                buildTimeMillis:prettyMilliseconds(ob.build_time_millis),
                body:ob.body,
                build_url:ob.build_url,
                committer_name:ob.committer_name,
                author:ob.user.login,
                jobStatus: ob.status
            }
        )
      }
    }
    return latest;
  }



/*  
 const res = await setTimeout(async () => {
    return {
      statusGeneratedOn: "April 22nd 2020, 6:59:57 pm IST",
      deployments: [
        {
          env: "Prod-Beta",
          branchDeployed: "develop",
          buildNumber: "8438",
          buildStartedOn: "April 21st 2020, 6:02:09 pm IST",
          buildFinishedOn: "April 21st 2020, 6:20:09 pm IST",
        },
        {
          env: "Prod-Beta",
          branchDeployed: "develop",
          buildNumber: "8438",
          buildStartedOn: "April 21st 2020, 6:02:09 pm IST",
          buildFinishedOn: "April 21st 2020, 6:02:09 pm IST",
        },
        {
          env: "Prod-Beta",
          branchDeployed: "develop",
          buildNumber: "8438",
          buildStartedOn: "April 21st 2020, 6:02:09 pm IST",
          buildFinishedOn: "April 21st 2020, 6:02:09 pm IST",
        },
        {
          env: "Prod-Beta",
          branchDeployed: "develop",
          buildNumber: "8438",
          buildStartedOn: "April 21st 2020, 6:02:09 pm IST",
          buildFinishedOn: "April 21st 2020, 6:02:09 pm IST",
        },
      ],
    };
  }, 3000);





*/
