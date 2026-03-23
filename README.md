# On-Chain Todo List (Solidity)

A beginner-friendly smart contract project that stores todo tasks on-chain.

You can add tasks, mark them complete, and delete them. Tasks are stored per user by wallet address using `msg.sender`.

## What This Project Demonstrates

- Solidity `struct` usage
- Dynamic arrays in storage
- Mapping wallet addresses to user-specific data
- Simple CRUD operations in a smart contract

## Features

- Add task
- Update task text
- Toggle complete or incomplete
- Delete task
- Read one task or all tasks
- Separate todo list for each user address
- Input validation with custom errors

## Tech Stack

- Solidity `^0.8.24`
- Hardhat
- Ethers.js
- Chai

## Project Structure

```text
contracts/
  TodoList.sol        # Main smart contract
scripts/
  demo.js             # Simple local demo flow (deploy + interactions)
test/
  TodoList.js         # Unit tests
hardhat.config.js     # Hardhat config
```

## Prerequisites

- Node.js 18+ (Node 20+ recommended)
- npm

## Quick Start (No Wallet Account Needed)

This project works on Hardhat's local in-memory blockchain. No MetaMask or real account is required.

1. Install dependencies

```powershell
npm install
```

2. Compile contracts

```powershell
npm run compile
```

3. Run tests

```powershell
npm test
```

4. Run local demo script

```powershell
npm run demo
```

The demo script will:

- Deploy `TodoList`
- Add tasks
- Toggle completion
- Delete a task
- Print results in terminal

## Available Commands

- `npm run compile` -> compile contracts
- `npm test` -> run unit tests
- `npm run demo` -> run local interaction demo
- `npm run node` -> start a persistent local Hardhat network

## Contract Overview

Main contract: `TodoList`

Storage:

- `struct Task { string text; bool completed; }`
- `mapping(address => Task[]) private userTasks`

Main functions:

- `addTask(string _text)`
- `updateTaskText(uint256 _taskIndex, string _newText)`
- `toggleTaskComplete(uint256 _taskIndex)`
- `deleteTask(uint256 _taskIndex)`
- `getMyTask(uint256 _taskIndex)`
- `getMyTaskCount()`
- `getMyTasks()`

Events:

- `TaskAdded(address user, uint256 taskIndex, string text)`
- `TaskUpdated(address user, uint256 taskIndex, bool completed)`
- `TaskTextUpdated(address user, uint256 taskIndex, string text)`
- `TaskDeleted(address user, uint256 taskIndex)`

Custom errors:

- `EmptyTaskText()`
- `TaskTextTooLong()`
- `InvalidTaskIndex()`

Constraints:

- Max task text length is `280` bytes (`MAX_TASK_TEXT_LENGTH`).

## Testing Notes

Tests include:

- add and read tasks
- toggle task completion
- delete task behavior
- user isolation (`msg.sender` separation)

## Security and Limitations

- This is an educational contract, not production-audited.
- Deleting a task uses swap-and-pop for lower gas usage. This does not preserve task ordering.
- No role system or advanced access control is required because each user can only modify their own tasks via `msg.sender`.

## Local Network Usage

Use a persistent local network when testing scripts manually across terminals:

1. Start node:

```powershell
npm run node
```

2. In another terminal, run demo on localhost:

```powershell
npx hardhat run scripts/demo.js --network localhost
```

## License

This project is licensed under the MIT License.

See the `LICENSE` file for full text.
