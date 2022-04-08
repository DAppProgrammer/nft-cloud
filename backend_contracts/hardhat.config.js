require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

require("dotenv").config();
const { INFURA_KEY, PRIVATE_KEYS, ETHERSCAN_KEY } =
  process.env;

MUMBAI_TESTNET = `https://polygon-mumbai.infura.io/v3/${INFURA_KEY}`;
POLYGON_MAINNET = `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`;

module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: MUMBAI_TESTNET,
      accounts: PRIVATE_KEYS.split(",")
    },
    mainnet: {
      url: POLYGON_MAINNET,
      accounts: PRIVATE_KEYS.split(",")
    }
  },
  paths: {
    artifacts: "../frontend_client/artifacts"
  },
  etherscan: {
    apiKey: ETHERSCAN_KEY
  }
};
