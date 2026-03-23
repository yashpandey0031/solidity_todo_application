const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TodoList", function () {
  async function expectCustomError(promise, contract, customErrorName) {
    try {
      await promise;
      expect.fail(`Expected custom error ${customErrorName}`);
    } catch (error) {
      const revertData = error.data || error?.error?.data;
      expect(
        revertData,
        "Missing revert data for custom error decoding",
      ).to.be.a("string");

      const parsedError = contract.interface.parseError(revertData);
      expect(parsedError?.name).to.equal(customErrorName);
    }
  }

  async function deployTodoListFixture() {
    const [owner, otherUser] = await ethers.getSigners();
    const TodoList = await ethers.getContractFactory("TodoList");
    const todoList = await TodoList.deploy();
    await todoList.waitForDeployment();
    return { todoList, owner, otherUser };
  }

  it("adds and reads tasks", async function () {
    const { todoList } = await deployTodoListFixture();

    await todoList.addTask("Buy milk");

    expect(await todoList.getMyTaskCount()).to.equal(1n);
    const [text, completed] = await todoList.getMyTask(0);
    expect(text).to.equal("Buy milk");
    expect(completed).to.equal(false);
  });

  it("toggles completion", async function () {
    const { todoList } = await deployTodoListFixture();

    await todoList.addTask("Learn Solidity");
    await todoList.toggleTaskComplete(0);

    const [, completed] = await todoList.getMyTask(0);
    expect(completed).to.equal(true);
  });

  it("deletes tasks", async function () {
    const { todoList } = await deployTodoListFixture();

    await todoList.addTask("Task 1");
    await todoList.addTask("Task 2");
    await todoList.deleteTask(0);

    expect(await todoList.getMyTaskCount()).to.equal(1n);
    const [text] = await todoList.getMyTask(0);
    expect(text).to.equal("Task 2");
  });

  it("keeps tasks separate per user", async function () {
    const { todoList, otherUser } = await deployTodoListFixture();

    await todoList.addTask("Owner task");
    await todoList.connect(otherUser).addTask("Other user task");

    expect(await todoList.getMyTaskCount()).to.equal(1n);
    expect(await todoList.connect(otherUser).getMyTaskCount()).to.equal(1n);

    const [ownerText] = await todoList.getMyTask(0);
    const [otherUserText] = await todoList.connect(otherUser).getMyTask(0);

    expect(ownerText).to.equal("Owner task");
    expect(otherUserText).to.equal("Other user task");
  });

  it("reverts on invalid input and indexes", async function () {
    const { todoList } = await deployTodoListFixture();

    // Validate all common guard checks that should fail fast.
    await expectCustomError(todoList.addTask(""), todoList, "EmptyTaskText");
    await expectCustomError(
      todoList.toggleTaskComplete(0),
      todoList,
      "InvalidTaskIndex",
    );
    await expectCustomError(
      todoList.deleteTask(0),
      todoList,
      "InvalidTaskIndex",
    );
    await expectCustomError(
      todoList.getMyTask(0),
      todoList,
      "InvalidTaskIndex",
    );
  });

  it("updates task text in-place", async function () {
    const { todoList } = await deployTodoListFixture();

    await todoList.addTask("Original");
    await todoList.updateTaskText(0, "Updated");

    const [text, completed] = await todoList.getMyTask(0);
    expect(text).to.equal("Updated");
    expect(completed).to.equal(false);
  });

  it("reverts when updating text with invalid payload", async function () {
    const { todoList } = await deployTodoListFixture();
    const longText = "a".repeat(281);

    await todoList.addTask("Task");
    await expectCustomError(todoList.updateTaskText(0, ""), todoList, "EmptyTaskText");
    await expectCustomError(todoList.updateTaskText(0, longText), todoList, "TaskTextTooLong");
  });
});
