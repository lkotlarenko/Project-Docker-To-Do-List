const { readCommand, resultOutput } = require('../util');
const { requirements } = require('../../.trybe/requirements.json');
const { resultCriteria } = require('../constants');

describe(requirements[5].description, () => {
  it("O avaliador deve executar o comando no arquivo 'command06.dc'", async () => {
    const { stdout: result } = await readCommand(6);
    expect(result).not.toBeNull();
    expect(result).not.toContain('Error');

    expect(result).toContain('1.21.3-alpine');
    expect(result).toContain('library/nginx');
    expect(result).toContain('Pull complete');
    expect(result).toContain('Status: Downloaded');

    const { stdout: containerCounter } = await readCommand(false, 'docker ps -aq | wc -l', false);
    expect(containerCounter).toStrictEqual('0');
  });
});

describe(requirements[6].description, () => {
  it("O avaliador deve executar o comando no arquivo 'command07.dc'", async () => {
    const { stdout: containerID } = await readCommand(7);
    expect(containerID).not.toBeNull();
    expect(containerID).not.toContain('Error');

    expect(containerID).toHaveLength(64);

    const { stdout: containerCounter } = await readCommand(false, 'docker ps -aq | wc -l', false);
    expect(containerCounter).toStrictEqual('1');

    const { stdout: commandValidation } = await
    readCommand(false, `docker inspect --format="${resultCriteria}" ${containerID}`, false);
    expect(commandValidation)
      .toStrictEqual(
        resultOutput({
          containerName: "02images",
          containerID,
          imageName: "nginx",
          imageTag: "1.21.3-alpine",
          stateStatus: "running",
          stateRunning: true,
          hostConfigPortBindings: "map[80/tcp:[map[HostIp: HostPort:3000]]]"
        })
      );
  });
  it("O avaliador tentará acessar a página padrão 'localhost:3000' para validar o processo", async () => {
    const { stdout: result } = await readCommand(false, 'curl -X GET http://localhost:3000', false);
    expect(result).not.toBeNull();
    expect(result).not.toContain('Error');

    expect(result).toContain('Welcome to nginx!');
    expect(result).toContain('If you see this page, the nginx web server is successfully installed');
    expect(result).toContain('Thank you for using nginx');
  });
});

describe(requirements[7].description, () => {
  it("O avaliador deve executar o comando no arquivo 'command08.dc'", async () => {
    const { stdout: result } = await readCommand(8);
    expect(result).not.toBeNull();
    expect(result).not.toContain('Error');

    expect(result).toContain('02images');

    const { stdout: containerCounter } = await readCommand(false, 'docker ps -q | wc -l', false);
    expect(containerCounter).toStrictEqual('0');
  });
});

describe(requirements[8].description, () => {
  it("O avaliador deve executar o comando no arquivo 'command09.dc'", async () => {
    const { stdout: result } = await readCommand(9);
    expect(result).not.toBeNull();
    expect(result).not.toContain('Error');

    expect(result).toContain('Successfully tagged todobackend:latest');

    const { stdout: containerCounter } = await readCommand(false, 'docker ps -q | wc -l', false);
    expect(containerCounter).toStrictEqual('0');

    const { stdout: imageIdentifier } = await readCommand(false, 'docker images -q todobackend | wc -l', false);
    expect(imageIdentifier).toStrictEqual('1');
  });
});

describe(requirements[9].description, () => {
  it("O avaliador deve executar o comando no arquivo 'command10.dc'", async () => {
    const { stdout: result } = await readCommand(10);
    expect(result).not.toBeNull();
    expect(result).not.toContain('Error');

    expect(result).toContain('Successfully tagged todofrontend:latest');

    const { stdout: containerCounter } = await readCommand(false, 'docker ps -q | wc -l', false);
    expect(containerCounter).toStrictEqual('0');

    const { stdout: imageIdentifier } = await readCommand(false, 'docker images -q todofrontend | wc -l', false);
    expect(imageIdentifier).toStrictEqual('1');
  });
});

describe(requirements[10].description, () => {
  it("O avaliador deve executar o comando no arquivo 'command11.dc'", async () => {
    const { stdout: result } = await readCommand(11);
    expect(result).not.toBeNull();
    expect(result).not.toContain('Error');

    expect(result).toContain('Successfully tagged todotests:latest');

    const { stdout: containerCounter } = await readCommand(false, 'docker ps -q | wc -l', false);
    expect(containerCounter).toStrictEqual('0');

    const { stdout: imageIdentifier } = await readCommand(false, 'docker images -q todotests | wc -l', false);
    expect(imageIdentifier).toStrictEqual('1');
  });
});
