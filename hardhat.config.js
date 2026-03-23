require("@nomicfoundation/hardhat-ethers");

module.exports = {
  defaultNetwork: "hardhat",
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    localhost: {
      url: process.env.LOCALHOST_RPC_URL || "http://127.0.0.1:8545",
    },
  },
  mocha: {
    timeout: 20000,
  },
};
