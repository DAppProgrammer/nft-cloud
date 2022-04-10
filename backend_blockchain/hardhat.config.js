require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

require("dotenv").config();
const { INFURA_KEY, PRIVATE_KEYS, POLYGONSCAN_KEY } = process.env;

module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${INFURA_KEY}`,
      accounts: PRIVATE_KEYS.split(",")
    },
    mainnet: {
      url: `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
      accounts: PRIVATE_KEYS.split(",")
    }
  },
  paths: {
    artifacts: "../frontend/src/artifacts"
  },
  etherscan: {
    apiKey: POLYGONSCAN_KEY
  }
};
