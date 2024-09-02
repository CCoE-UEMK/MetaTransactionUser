require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
const { ethers } = require("ethers");

function getAccounts() {
  if (process.env.PRIVATE_KEY1) {
    return [process.env.PRIVATE_KEY1];
  } else if (process.env.MNEMONIC) {
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
    return [wallet.privateKey];
  }
  return [];
}

module.exports = {
  solidity: "0.8.0",
  networks: {
    xdc: {
      url: `https://earpc.xinfin.network`,
      accounts: getAccounts(),
      chainId: 50, // XDC Network chain ID
    },
    test_xdc: {
      url: `https://earpc.apothem.network`,
      accounts: getAccounts(),
      chainId: 51,
      gasPrice: 40000000000, // 40 Gwei (Example, adjust based on the network's requirement)
      timeout: 600000,
    },
    apothem: {
      url: `https://earpc.apothem.network`,
      accounts: getAccounts(),
      chainId: 51,
      gasPrice: 40000000000, // 40 Gwei (Example, adjust based on the network's requirement)
      timeout: 600000,
    },
  },
  etherscan: {
    apiKey: "metaTransactionVerifier", // Replace with your Etherscan API key,
    customChains: [
      {
        network: "xdc",
        chainId: 50,
        urls: {
          apiURL: "https://api.xdcscan.io/api",
          browserURL: "https://xdcscan.io"
        }
      },
      {
        network: "test_xdc",
        chainId: 51,
        urls: {
          apiURL: "https://api-apothem.xdcscan.io/api",
          browserURL: "https://apothem.xdcscan.io"
        }
      },
      {
        network: "apothem",
        chainId: 51,
        urls: {
          apiURL: "https://api-apothem.xdcscan.io/api",
          browserURL: "https://apothem.xdcscan.io"
        }
      }
    ]
  },
};

