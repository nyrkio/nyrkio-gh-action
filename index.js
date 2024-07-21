// Copyright (C) 2024 Nyrkiö Oy
const fs = require("fs");
const core = require("@actions/core");
const github = require("@actions/github");

try {
  // const filename = core.getInput("filename");
  // fs.promises.readFile(filename, "utf8").then((data) => {
  //   console.log(data);
  // });
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput("who-to-greet");
  console.log(`Hello ${nameToGreet}!`);
  const time = new Date().toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);

  // Find all estimates.json files in any 'new' subdirectories of the 'examples' directory
  const estimates = [];
  const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach((file) => {
      const path = require("path");
      file.isDirectory
        ? (filelist = walkSync(path.join(dir, file), filelist))
        : filelist.push(path.join(dir, file));
    });
    return filelist;
  };
  const files = walkSync("examples");
  files.forEach((file) => {
    if (file.includes("estimates.json")) {
      estimates.push(file);
    }
  });
  console.log(estimates);

  fs.readFile(
    "examples/criterion/limbo/Execute prepared statement_ 'SELECT 1'/new/estimates.json",
    "utf8",
    (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(data);
    }
  );
} catch (error) {
  core.setFailed(error.message);
}
