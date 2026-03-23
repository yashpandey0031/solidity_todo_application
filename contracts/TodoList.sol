// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TodoList {
    struct Task {
        string text;
        bool completed;
    }

    // Each wallet gets its own list of tasks.
    mapping(address => Task[]) private userTasks;

    event TaskAdded(address indexed user, uint256 indexed taskIndex, string text);
    event TaskUpdated(address indexed user, uint256 indexed taskIndex, bool completed);
    event TaskDeleted(address indexed user, uint256 indexed taskIndex);

    function addTask(string calldata _text) external {
        require(bytes(_text).length > 0, "Task text cannot be empty");

        userTasks[msg.sender].push(Task({text: _text, completed: false}));

        uint256 newIndex = userTasks[msg.sender].length - 1;
        emit TaskAdded(msg.sender, newIndex, _text);
    }

    function toggleTaskComplete(uint256 _taskIndex) external {
        require(_taskIndex < userTasks[msg.sender].length, "Invalid task index");

        Task storage task = userTasks[msg.sender][_taskIndex];
        task.completed = !task.completed;

        emit TaskUpdated(msg.sender, _taskIndex, task.completed);
    }

    function deleteTask(uint256 _taskIndex) external {
        uint256 length = userTasks[msg.sender].length;
        require(_taskIndex < length, "Invalid task index");

        // Move all tasks one step left to keep ordering simple.
        for (uint256 i = _taskIndex; i < length - 1; i++) {
            userTasks[msg.sender][i] = userTasks[msg.sender][i + 1];
        }

        userTasks[msg.sender].pop();
        emit TaskDeleted(msg.sender, _taskIndex);
    }

    function getMyTask(uint256 _taskIndex) external view returns (string memory text, bool completed) {
        require(_taskIndex < userTasks[msg.sender].length, "Invalid task index");

        Task storage task = userTasks[msg.sender][_taskIndex];
        return (task.text, task.completed);
    }

    function getMyTaskCount() external view returns (uint256) {
        return userTasks[msg.sender].length;
    }

    function getMyTasks() external view returns (Task[] memory) {
        return userTasks[msg.sender];
    }
}
