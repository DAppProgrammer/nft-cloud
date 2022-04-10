# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

NFTMarket deployed to: 0x20D63204bad2eBFe7475d2eE37FcDb68953EAAbd
NFT deployed to: 0x86e3E68BBF3ef96d612d84102B1255Eb0D85DFeb

npx hardhat verify 0x20D63204bad2eBFe7475d2eE37FcDb68953EAAbd --network mumbai

Successfully submitted source code for contract
contracts/NFTMarket.sol:NFTMarket at 0x20D63204bad2eBFe7475d2eE37FcDb68953EAAbd
for verification on the block explorer. Waiting for verification result...

Successfully verified contract NFTMarket on Etherscan.
https://mumbai.polygonscan.com/address/0x20D63204bad2eBFe7475d2eE37FcDb68953EAAbd#code




npx hardhat verify 0x86e3E68BBF3ef96d612d84102B1255Eb0D85DFeb 0x20D63204bad2eBFe7475d2eE37FcDb68953EAAbd --network mumbai

Successfully submitted source code for contract
contracts/NFT.sol:NFT at 0x86e3E68BBF3ef96d612d84102B1255Eb0D85DFeb
for verification on the block explorer. Waiting for verification result...

Successfully verified contract NFT on Etherscan.
https://mumbai.polygonscan.com/address/0x86e3E68BBF3ef96d612d84102B1255Eb0D85DFeb#code