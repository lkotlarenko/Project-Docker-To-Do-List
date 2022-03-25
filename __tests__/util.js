const { resolve } = require('path');
const { promisify } = require('util');
const { log: consoleLog, warn: consoleWarn } = require('console');
const { readFile } = require('fs/promises');

const { evalId } = require('./constants');

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const putZero = (number = 0) => (number < 10 ? `0${number}` : number);

const exec = promisify(require('child_process').exec);

const validate = (command = '') => {
  if (
    !command
    || (
      !command.startsWith('docker ')
      && !command.startsWith('docker-compose ')
    )
    || (
      command.includes("&")
      || command.includes("|")
      || command.includes("(")
      || command.includes(")")
      || command.includes(";")
    )
  ) {
    throw new Error(`Comando inválido\n'${command}'`);
  }
  return command;
};

const readCommand = async (
  number = 0,
  custom = '',
  log = true,
) => new Promise(async (res, rej) => {
  try {
    const command = number !== false
      ? await readFile(
        resolve(
          'docker',
          'docker-commands',
          `command${putZero(number)}.dc`,
        ), { encoding: 'utf-8' },
      ) : '';
    return res([command.replace(/\n$/, '').trim(), custom].join(' '));
  } catch (err) {
    return rej(err);
  }
})
  .then((command) =>
    (number !== false && !custom) ? validate(command.trim()) : command.trim())
  .then(async (command) => {
    const { stdout: current, stderr } = await exec(`docker exec ${evalId} /bin/sh -c '${command}'`);

    if (log) {
      if (current) {
        consoleLog(`\n----\nSaída do comando ${number}:\n\n${current}----\n`);
      }
      if (stderr) {
        consoleWarn(`\n----\nAlerta ou Erro do comando ${number}:\n\n${stderr}----\n`);
      }
    }

    await delay(1000);
    return {
      stdout: current.replace(/\n$/, '').trim(),
      stderr,
    };
  });

const resultOutput = ({
  containerName, 
  containerID, 
  imageName, 
  imageTag, 
  stateStatus, 
  stateRunning,
  hostConfigPortBindings = "map[]",
}) => `/${[
  containerName, 
  containerID, 
  imageName+':'+imageTag, 
  stateStatus, 
  stateRunning, 
  hostConfigPortBindings]
    .join(";")
    .replace(/;$/,'')}`;

module.exports = {
  delay,
  exec,
  readCommand,
  validate,
  resultOutput,
};
