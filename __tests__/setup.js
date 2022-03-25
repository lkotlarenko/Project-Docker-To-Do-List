const { exec, delay } = require('./util');
const { 
  evalId,
  challengesFolder: dockerDir, 
  containerWorkDir: workDir, 
  defaultDelay 
} = require('./constants');

global.beforeAll(async () => {
  await exec(`docker rm -fv $(docker ps -qaf name=trybe-eval-)`)
    .catch(() => true);

  await exec([
    "docker run",
      `--name ${evalId}`,
      "--privileged",
      "-d",
      `-w ${workDir}`,
      `-v ${dockerDir}:${workDir}`,
      "mjgargani/docker:dind-trybe1.0"
  ].join(" "));

  await delay(defaultDelay);
});

global.afterAll(async () => {
  await exec(`docker rm -fv $(docker ps -qaf name=trybe-eval-)`)
    .catch(() => true);
});
