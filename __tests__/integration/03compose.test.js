const { readCommand } = require('../util');
const { evalId, one, composeTries } = require('../constants');
const { requirements } = require('../../.trybe/requirements.json');

describe(requirements[11].description, () => {
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
  it("O avaliador deve executar o comando no arquivo 'command12.dc'", async () => {
    const { stdout: result } = await readCommand(12);

    expect(result).not.toBeNull();
    expect(result).not.toContain('Error');

    const { stdout: containerNames } = await readCommand(false, 'docker ps --format "{{.Names}}"', false);
    expect(containerNames).toContain(evalId);
    expect(containerNames).toContain('back_1');
    expect(containerNames).toContain('front_1');
    expect(containerNames).toContain('tests_1');

    const { stdout: activeContainerCounter } = await
    readCommand(false, 'docker ps -q | wc -l', false);
    expect(activeContainerCounter).toStrictEqual('3');
  });
  it('O avaliador deve aguardar os logs dos resultados do teste de saúde do "todo-app"', async () => {
    let round = one;
    const resolveBeforeMaxTries = await new Promise((res) => {
      const logCommand = setInterval(async () => {
        const testAprove = (pass) => {
          clearInterval(logCommand);
          res(pass);
        }

        const { stderr: testOutput } = await readCommand(false, 'docker logs $(docker ps -aqf name=todotests_1)');

        if (testOutput.includes('7 passed, 7 total')) {
          return testAprove(true);
        }
        
        if(round === composeTries) {
          return testAprove(false);
        }
        round += one;
      }, 15000);
    });
    expect(resolveBeforeMaxTries).toStrictEqual(true);
  });
});
