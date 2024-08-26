# MetaTransactionVerifier

A simple Solidity smart contract that verifies and executes meta-transactions using EIP-712 signatures.

## Features

- **Meta-Transaction Verification**: Verifies the validity of a meta-transaction using the user's signature.
- **Meta-Transaction Execution**: Executes the meta-transaction if it passes verification.
- **Event Emission**: Emits an event upon successful execution of the meta-transaction.

## Prerequisites

- Node.js and npm/yarn installed.
- Hardhat framework for deployment and testing.
- An XDC network for contract deployment (e.g., XDC Mainnet, Testnet, XDC Subnet, or local blockchain).

## Installation

1. Clone the repository:
     ``` 
     git clone https://github.com/AnilChinchawale/MetaTransactionVerifier.git
   cd MetaTransactionVerifier
    ```

2. Install dependencies:
     ``` npm install```

3. Set up environment variables:
    - Create a `.env` file in the root directory.
    - Add the following environment variables:
  ```
  MNEMONIC="your wallet mnemonic"
  ```


## Usage

### Compile the Smart Contract

To compile the smart contract, run:
  ```
  npx hardhat compile

  ```

### Deploy the Smart Contract

To deploy the contract to Apothem of choice:
  ```
npx hardhat run scripts/deploy.js --network apothem
  ```

Verify the Smart Contract

To verify the contract on XDCScan.io :

  ```
npx hardhat verify --network apothem DEPLOYED_CONTRACT_ADDRESS

  ```

Replace `apothem` with your network name and `DEPLOYED_CONTRACT_ADDRESS` with the actual deployed contract address.

## Smart Contract Overview

The MetaTransactionVerifier contract contains the following key functions:
- `executeMetaTransaction`: Verifies and executes the meta-transaction.
- `verify`: Recreates the signed message and verifies the signature.

## License

[MIT](https://choosealicense.com/licenses/mit/)
