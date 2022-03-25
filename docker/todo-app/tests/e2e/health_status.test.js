const puppeteer = require('puppeteer-core');

let elements = {
  taskInput: '[data-testid="todo-task-input"]',
  taskAdd: '[data-testid="todo-task-add"]',
  taskList: '[data-testid="todo-task-list"]',
  taskItemRow: '.item-row',
  taskItemRowDesc: '.item-row-desc',
  taskCheck: '[data-testid^="todo-task-check-input-"]',
  taskEditMode: '[data-testid^="todo-task-edit-mode-btn-"]',
  taskRemove: '[data-testid^="todo-task-remove-btn-"]',
  taskEditInput: '[data-testid^="todo-task-edit-input-"]',
  taskEditSave: '[data-testid^="todo-task-edit-save-btn-"]',
  taskEditCancel: '[data-testid^="todo-task-edit-cancel-btn-"]',
};

const defaultTasks = [
  "Estudar os conteúdos de Docker da Trybe",
  "Resolver o projeto Docker Todo List"
];

const defaultDelay = 750;

const HOST = process.env.FRONT_HOST || "localhost";
const PORT = process.env.FRONT_PORT || 3000;

describe("Teste de saúde da aplicação 'Docker Trybe Todo-List'", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      product: "chrome",
      executablePath: process.env.CHROME_BIN || null,
      args: [
        "--no-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--window-size=1270,720",
      ],
      defaultViewport: { width: 1260, height: 590 },
    });

    page = await browser.newPage();

    await page.waitForTimeout(15000);
    await page.goto(`http://${HOST}:${PORT}/debug`);
  });
  
  afterAll(async () => {
    await browser.close();
  });
  
  it("Verifica se o endereço 'localhost:3000' dá acesso a página correta", async () => {
    const title = await page.title();

    expect(title).toStrictEqual("Trybe Docker Todo-List");
  });

  it("Identifica se os data-testid necessários estão presentes", async ()=>{
    expect(await page.$(elements.taskInput)).not.toBeNull();
    expect(await page.$(elements.taskAdd)).not.toBeNull();

    const tasks = Array.from(await page.$$(elements.taskList + " > " + elements.taskItemRow));

    expect(tasks.length).toStrictEqual(2);

    for (let i = 0; i < tasks.length; i+=1) {
      expect(await page.$(elements.taskCheck + `[data-testid$="${i}"]`)).not.toBeNull();
      expect(await page.$(elements.taskEditMode + `[data-testid$="${i}"]`)).not.toBeNull();
      expect(await page.$(elements.taskRemove + `[data-testid$="${i}"]`)).not.toBeNull();
    }
  });

  it("Identifica se as tasks padrão estão presentes", async () => {
    const pageTasks = await page.$$eval(elements.taskItemRowDesc, (items)=>{
      return items.map(el=> el.innerText)
    });

    expect(defaultTasks.sort()).toStrictEqual(pageTasks.sort());
  });

  it("Adiciona novas tasks", async () => {
    const newTasks = [
      "Relembrar os comandos básicos do Docker CLI",
      "Entender o funcionamento dos Dockerfiles",
      "Orquestrar meus próprios containers"
    ];
    const newTaskList = [
      ...defaultTasks,
      ...newTasks
    ];

    for (const task of newTasks) {
      await page.type(elements.taskInput, task, { delay: 100 });
      await page.click(elements.taskAdd);
      await page.waitForTimeout(defaultDelay);
      await page.reload();
    }

    const pageTasks = await page.$$eval(elements.taskItemRowDesc, (items)=>{
      return items.map(el=> el.innerText)
    });

    expect(newTaskList.sort()).toStrictEqual(pageTasks.sort());
  });

  it("Marca como concluído esses mesmos itens", async () => {
    const checkItens = [4,3,2];

    for (const item of checkItens) {
      const elemTarget = elements.taskCheck + `[data-testid$="${item}"]`;
      await page.click(elemTarget);
      await page.waitForTimeout(defaultDelay);
      await page.reload();
      const elementCheck = await page.$eval(elemTarget, (el)=> el.checked);

      expect(elementCheck).toStrictEqual(true);
    }
  });

  it("Remove esses mesmos itens", async () => {
    const checkItens = [4,3,2];

    for (const item of checkItens) {
      const elemTarget = elements.taskRemove + `[data-testid$="${item}"]`;
      await page.click(elemTarget);
      await page.waitForTimeout(defaultDelay);
      await page.reload();
    }

    const pageTasks = await page.$$eval(elements.taskItemRowDesc, (items)=>{
      return items.map(el=> el.innerText)
    });

    expect(defaultTasks.sort()).toStrictEqual(pageTasks.sort());
  });

  it("Marca o segundo item como concluído", async () => {
    const elemTarget = elements.taskCheck + `[data-testid$="1"]`;
    await page.click(elemTarget);
    await page.waitForTimeout(defaultDelay);
    await page.reload();
    const elementCheck = await page.$eval(elemTarget, (el)=> el.checked);

    expect(elementCheck).toStrictEqual(true);
  });
})
