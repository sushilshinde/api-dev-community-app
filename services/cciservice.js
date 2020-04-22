require("moment-timezone");
const axios = require("axios");
const moment = require("moment");
require("dotenv").config();
exports.getEnvironmentDeployments = async () => {
  let data = null;
  try {
    //try to get data
    const response = await axios.get(`https://circleci.com/api/v1.1/project/github/${process.env.user}/${process.env.project}?circle-token=${process.env.CCItoken}&limit=99`);
    data = response.data;
    
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
        tracker.push(ob.workflows.job_name)
        latest.push(
            {
                env: ob.workflows.job_name.replace("build-", ""),
                branchDeployed: ob.branch,
                buildNumber: ob.build_num,
                buildStartedOn: moment(ob.start_time).tz("Asia/Kolkata").format("MMMM Do YYYY, h:mm:ss a"),
                buildFinishedOn: moment(ob.stop_time).tz("Asia/Kolkata").format("MMMM Do YYYY, h:mm:ss a"),
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
                buildFinishedOn: null,
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
