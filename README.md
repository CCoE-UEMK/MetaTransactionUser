#Hardhat Meta-Transaction DApp
This project sets up a Hardhat-based Ethereum development environment with a Solidity smart contract for 
meta-transaction verification and execution on the XDC blockchain. Users can make fiat payment (gasless) for transaction initiation through square payment gateway. The relayer submits transaction on behalf of the user in XDC blockchain using gas. 
It includes an Express server and a simple web interface to interact with the contract.

#Features
Meta-Transaction Verification: Verifies and processes meta-transactions using user signatures.
Meta-Transaction Execution: Executes transactions on behalf of users.
Web Interface: Provides a front-end to submit meta-transactions.
Express Server: Handles requests and interacts with the smart contract.

#Prerequisites
Node.js and npm installed.
Basic knowledge of Solidity, Hardhat, and Express.js.
An XDC blockchain setup for deployment (e.g., XDC Apothem).

#Installation
1. Clone the Repository:
 ``` git clone https://github.com/CCoE-UEMK/MetaTransactionUser.git  ```
 ```cd MetaTransactionUser ```
2. Install Dependencies:
 ``` npm install ```
3. Set Up Environment Variables:
Create a .env file in the root directory.
Add the following environment variables:
 ```RPC_URL=https://earpc.apothem.network 
      MNEMONIC=your-wallet-mnemonic ```

#Usage
Compile the Smart Contract
To compile the smart contract, run:
 ```npx hardhat compile ```

#Deploy the Smart Contract
To deploy the contract to the XDC Apothem network, use:
 ```npx hardhat run scripts/deploy.js --network test_xdc ```

#Start the Express Server
To start the server, run:

 ```npm start ```
 
This will start the server on http://localhost:3061.

#Access the Web Interface
Open your browser and navigate to http://localhost:3061 to interact with the web interface. Enter the user address, message, and payment proof from user and then submit the meta-transaction.

#Smart Contract Overview
The smart contract located in contracts/MetaTransaction.sol includes the following functions:
executeMetaTransaction: Verifies and executes a meta-transaction.
exampleFunction: A sample function that can be called through a meta-transaction.

#Express Server Overview
The server.js file sets up an Express server with the following endpoint:

POST /api/execute-meta-transaction: Receives user address and message from the web interface and executes the meta-transaction using the provided data.

#Project Structure
.
├── contracts
│   └── MetaTransaction.sol
├── scripts
│   └── deploy.js
├── public
│   ├── index.html
├── server.js
├── .env
├── hardhat.config.js
├── package.json
├── package-lock.json
└── README.md

#License MIT

