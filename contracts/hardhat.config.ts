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
        "0x50208fd4277464f1b876c1355519b41b13fd4522252d5ee0dbd851b6d6e7dd36",
      ],
    },
  },
};

export default config;
