require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

module.exports = {
    
  solidity: "0.8.0",
  networks: {
    xdc: {
      url: `https://earpc.xinfin.network`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 50, // XDC Network chain ID
    },
    test_xdc: {
      url: `https://earpc.apothem.network`,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 51,
      gasPrice: 20000000000, // 20 Gwei (Example, adjust based on the network's requirement)
      timeout: 20000,
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
      }
    ],
    customChains: [
      {
        network: "test_xdc",
        chainId: 51,
        urls: {
          apiURL: "https://api-apothem.xdcscan.io/api",
          browserURL: "https://apothem.xdcscan.io"
        }
      }
    ]
  },
};