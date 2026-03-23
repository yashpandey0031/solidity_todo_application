const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using local test account:", deployer.address);

  const TodoList = await ethers.getContractFactory("TodoList");
  const todoList = await TodoList.deploy();
  await todoList.waitForDeployment();

  const address = await todoList.getAddress();
  console.log("TodoList deployed at:", address);

  await (await todoList.addTask("Buy groceries")).wait();
  await (await todoList.addTask("Practice Solidity")).wait();

  let count = await todoList.getMyTaskCount();
  console.log("Task count after add:", count.toString());

  await (await todoList.toggleTaskComplete(0)).wait();
  const firstTask = await todoList.getMyTask(0);
  console.log("Task 0 after toggle:", firstTask);

  await (await todoList.deleteTask(1)).wait();
  count = await todoList.getMyTaskCount();
  console.log("Task count after delete:", count.toString());

  const tasks = await todoList.getMyTasks();
  console.log("All tasks:", tasks);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
