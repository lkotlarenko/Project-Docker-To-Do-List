const { resolve } = require('path');
const uuid = require('uuid').v4;
const evalId = process.env.EVAL_CONTAINER_NAME || `trybe-eval-${uuid()}`;

module.exports = {
  evalId,
  challengesFolder: resolve('docker'),
  containerWorkDir: `/${evalId}`,
  defaultDelay: 10000,
  resultCriteria: "{{(index .Name)}};"+
                  "{{(index .Id)}};"+
                  "{{(index .Config.Image)}};"+
                  "{{(index .State.Status)}};"+
                  "{{(index .State.Running)}};"+
                  "{{(index .HostConfig.PortBindings)}}",
  composeTries: 5,
  one: 1
};
