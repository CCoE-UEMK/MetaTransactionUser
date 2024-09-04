// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
const port = 3060;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (e.g., index.html)

// Meta-Transaction Endpoint
app.post('/api/execute-meta-transaction', async (req, res) => {
    const { userAddress, message, paymentProof } = req.body;
     // Validate and process the payment proof here
    // Example: Verify paymentProof with payment gateway API

    if (!userAddress || !message) {
        return res.status(400).json({ status: 'Invalid input' });
    }

    try {
        const MNEMONIC = process.env.MNEMONIC;
        const RPC_URL = process.env.RPC_URL;
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const wallet = ethers.Wallet.fromMnemonic(MNEMONIC).connect(provider);

        const contractAddress = "0xe06E5d5458066CD89843D604DA5a0a687f1D63ab"; // Replace with your contract address
        const abi = [
            "function executeMetaTransaction(address userAddress, bytes memory functionSignature, uint8 v, bytes32 r, bytes32 s) public payable returns (bytes memory)",
            "function exampleFunction(string memory message) public pure returns (string memory)"
        ];
        const contract = new ethers.Contract(contractAddress, abi, wallet);

        // Generate the function signature
        const functionSelector = ethers.utils.id("exampleFunction(string)").slice(0, 10);
        const encodedParameters = ethers.utils.defaultAbiCoder.encode(["string"], [message]).slice(2);
        const functionSignature = functionSelector + encodedParameters;

        // Create the message hash
        const messageHash = ethers.utils.solidityKeccak256(
            ["address", "bytes"],
            [userAddress, functionSignature]
        );

        // Sign the message hash
        const signingKey = new ethers.utils.SigningKey(wallet.privateKey);
        const signature = signingKey.signDigest(messageHash);

        // Extract v, r, s from the signature
        const { v, r, s } = signature;

        // Execute meta-transaction
        const tx = await contract.executeMetaTransaction(userAddress, functionSignature, v, r, s, {
            gasPrice: ethers.utils.parseUnits('20', 'gwei'),
            gasLimit: 100000
        });

        await tx.wait();
        res.json({ status: 'Transaction confirmed' });
    } catch (error) {
        console.error('Error executing meta-transaction:', error);
        res.status(500).json({ status: 'Error executing meta-transaction' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});




