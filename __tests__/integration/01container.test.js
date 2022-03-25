const { readCommand, resultOutput } = require('../util');
const { requirements } = require('../../.trybe/requirements.json');
const { resultCriteria } = require('../constants');

let resultHeader= {
  containerName: "01container",
  containerID: "",
  imageName: "alpine",
  imageTag: "3.12",
};

describe(requirements[0].description, () => {
  it("O avaliador deve executar o comando no arquivo 'command01.dc'", async () => {
    const { stdout: result } = await readCommand(1);
    expect(result).not.toBeNull();
    expect(result).not.toContain('Error');

    expect(result).toHaveLength(64);

    resultHeader.containerID = result;

    const { stdout: commandValidation } = await
      readCommand(false, `docker inspect --format="${resultCriteria}" ${resultHeader.containerID}`, false);
    expect(commandValidation)
      .toStrictEqual(
        resultOutput({
          ...resultHeader,
          stateStatus: "created",
          stateRunning: false
        })
      );
  });
});

describe(requirements[1].description, () => {
  it("O avaliador deve executar o comando no arquivo 'command02.dc'", async () => {
    const { stdout: createdValidation } = await
      readCommand(false, `docker inspect --format="${resultCriteria}" 01container`, false);
    expect(createdValidation)
      .toStrictEqual(
        resultOutput({
          ...resultHeader,
          stateStatus: "created",
          stateRunning: false
        })  
      );
    
    const { stdout: result } = await readCommand(2);
    expect(result).not.toBeNull();
    expect(result).not.toContain('Error');

    expect(result).toContain('01container');

    const { stdout: startValidation } = await
      readCommand(false, `docker inspect --format="${resultCriteria}" 01container`, false);
    expect(startValidation)
      .toStrictEqual(
        resultOutput({
          ...resultHeader,
          stateStatus: "running",
          stateRunning: true
        })  
      );
  });
});

describe(requirements[2].description, () => {
  it("O avaliador deve executar o comando no arquivo 'command03.dc'", async () => {
    const { stdout: filterValidation } = await readCommand(3, '| wc -l', false);
    expect(filterValidation).toStrictEqual('2');
    
    const { stdout: result } = await readCommand(3);
    expect(result).not.toBeNull();
    expect(result).not.toContain('Error');

    expect(result).toContain('alpine:3.12');
    expect(result).toContain('/bin/sh');
    expect(result).toContain('Up');
    expect(result).toContain('second');
    expect(result).toContain('01container');

    const { stdout: containerCounter } = await readCommand(false, 'docker ps -aq | wc -l', false);
    expect(containerCounter).toStrictEqual('1');
  });
});

describe(requirements[3].description, () => {
  it("O avaliador deve executar o comando no arquivo 'command04.dc'", async () => {
    const { stdout: result } = await readCommand(4);
    expect(result).not.toBeNull();
    expect(result).not.toContain('Error');

    expect(result).toContain('NAME="Alpine Linux"');
    expect(result).toContain('ID=alpine');
    expect(result).toContain('VERSION_ID=3.12');
  });
});

describe(requirements[4].description, () => {
  it("O avaliador deve executar o comando no arquivo 'command05.dc'", async () => {
    const { stdout: result } = await readCommand(5);
    expect(result).not.toBeNull();
    expect(result).not.toContain('Error');

    expect(result).toContain('01container');
  });
  it("O avaliador deve executar o comando no arquivo 'command03.dc' para validar esse resultado", async () => {
    const { stdout: result } = await readCommand(3);
    expect(result).not.toBeNull();
    expect(result).not.toContain('Error');

    expect(result).not.toContain('alpine:3.12');
    expect(result).not.toContain('/bin/sh');
    expect(result).not.toContain('Up');
    expect(result).not.toContain('second');
    expect(result).not.toContain('01container');

    const { stdout: containerCounter } = await readCommand(false, 'docker ps -aq | wc -l', false);
    expect(containerCounter).toStrictEqual('0');
  });
});
