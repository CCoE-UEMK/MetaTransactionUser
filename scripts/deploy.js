const hre = require("hardhat");
const { ethers } = require('ethers');
require('dotenv').config();

// Load environment variables from .env file
const MNEMONIC = process.env.MNEMONIC;
const RPC_URL = process.env.RPC_URL;

// Create an instance of the provider
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

// Create a wallet instance using mnemonic
const wallet = ethers.Wallet.fromMnemonic(MNEMONIC).connect(provider);

// Define the ABI of the MetaTransactionVerifier contract
const abi = [
    "event MetaTransactionExecuted(address indexed userAddress, bytes32 indexed messageHash)",
    "function executeMetaTransaction(address userAddress, bytes32 messageHash, uint8 v, bytes32 r, bytes32 s) public returns (bool)",
    "function verify(address userAddress, bytes32 messageHash, uint8 v, bytes32 r, bytes32 s) public pure returns (bool)"
];

async function main() {
    try {
        // Compile the contract
        console.log("Compiling the contract...");
        await hre.run('compile');

        // Deploy the MetaTransactionVerifier contract
        console.log("Deploying the MetaTransactionVerifier contract...");
        const MetaTransactionVerifier = await hre.ethers.getContractFactory("MetaTransactionVerifier");
        const metaTransactionVerifier = await MetaTransactionVerifier.deploy();
        await metaTransactionVerifier.deployed();
        console.log("MetaTransactionVerifier deployed to:", metaTransactionVerifier.address);

            // Verify the contract on the custom explorer
        await run("verify:verify", {
          address: metaTransactionVerifier.address,
          constructorArguments: [],
        });
        
        // // Create an instance of the MetaTransactionVerifier contract with the deployed address
        // const contract = new ethers.Contract(metaTransactionVerifier.address, abi, wallet);

        // // Interact with the deployed contract
        // const userAddress = '0x76026252f343A9Dc83CC642C873e5E06ABC2040f'; // Replace with the user's address
        // const messageHash = ethers.utils.id("0x6e2cfe5b41d79159951e9dcd2dfe1d0eb74383852a5b82c1e1709cb19cbb1c07"); // Replace with the actual message hash
        // const v = 27; // Replace with the actual v value
        // const r = '0x4832a0d313a289c154095e11c6ef26f3602d6908863073f01456c7a6d9432dfd'; // Replace with the actual r value
        // const s = '0x0a1f202e50dbe37e09a9151ac9e19e804b8ff276354b792c11af7a363b0d1dc2'; // Replace with the actual s value

        // // Verify the meta-transaction
        // const isVerified = await contract.verify(userAddress, messageHash, v, r, s);
        // console.log(`Is Verified: ${isVerified}`);

        // // if (isVerified) {
        //     // Execute the meta-transaction
        //     const tx = await contract.executeMetaTransaction(userAddress, messageHash, v, r, s);
        //     await tx.wait();
        //     console.log('Meta-transaction executed successfully');
        // // } else {
        // //     console.log('Meta-transaction verification failed');
        // // }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Execute the main function and handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("An error occurred during the deployment process:", error);
        process.exit(1);
    });
