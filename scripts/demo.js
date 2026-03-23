const { ethers } = require("hardhat");

function formatTask(task, index) {
  return `#${index} text="${task.text}" completed=${task.completed}`;
}

async function printTasks(todoList, label) {
  const tasks = await todoList.getMyTasks();
  console.log(`\n${label} (${tasks.length} tasks)`);
  tasks.forEach((task, index) => {
    console.log(" ", formatTask(task, index));
  });
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Using local test account:", deployer.address);

  const TodoList = await ethers.getContractFactory("TodoList");
  const todoList = await TodoList.deploy();
  await todoList.waitForDeployment();

  const address = await todoList.getAddress();
  console.log("TodoList deployed at:", address);

  const addOneTx = await todoList.addTask("Buy groceries");
  await addOneTx.wait();
  console.log("addTask #1 tx:", addOneTx.hash);

  const addTwoTx = await todoList.addTask("Practice Solidity");
  await addTwoTx.wait();
  console.log("addTask #2 tx:", addTwoTx.hash);

  let count = await todoList.getMyTaskCount();
  console.log("Task count after add:", count.toString());
  await printTasks(todoList, "After add");

  const toggleTx = await todoList.toggleTaskComplete(0);
  await toggleTx.wait();
  console.log("toggleTaskComplete tx:", toggleTx.hash);

  const updateTextTx = await todoList.updateTaskText(
    1,
    "Practice Solidity (events + tests)",
  );
  await updateTextTx.wait();
  console.log("updateTaskText tx:", updateTextTx.hash);
  await printTasks(todoList, "After toggle + update");

  const deleteTx = await todoList.deleteTask(1);
  await deleteTx.wait();
  console.log("deleteTask tx:", deleteTx.hash);

  count = await todoList.getMyTaskCount();
  console.log("Task count after delete:", count.toString());
  await printTasks(todoList, "Final state");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
