import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: "http://127.0.0.1:8545",
      // the private key of signers, change it according to your ganache user
      accounts: [
        "0x14572a8cf5213770c0bfb997c34e959e07dac15d270c5099746fb48a364aafab",
      ],
    },
  },
};

export default config;
