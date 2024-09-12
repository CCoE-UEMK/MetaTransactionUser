const express = require('express');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');
const { Client, Environment } = require('square'); // Correct package name is "square"
require('dotenv').config();

const app = express();
const port = 3061;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (e.g., index.html)

// Initialize Square Client
const squareClient = new Client({
    environment: Environment.Sandbox, // Use Environment.Production for live mode
    accessToken: process.env.SQUARE_ACCESS_TOKEN
});
const paymentsApi = squareClient.paymentsApi;

// Function to serialize BigInt values
const serializeBigInt = (obj) => {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'bigint') return obj.toString();
    if (typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, serializeBigInt(value)])
        );
    }
    return obj;
};

// Meta-Transaction Endpoint
app.post('/api/execute-meta-transaction', async (req, res) => {
    const { userAddress, message, paymentProof } = req.body;

    if (!userAddress || !message || !paymentProof) {
        return res.status(400).json({ status: 'Invalid input' });
    }

    try {
        // Verify the payment proof with Square
        const response = await paymentsApi.getPayment(paymentProof);
        const paymentData = serializeBigInt(response.result);

        if (paymentData.payment.status !== 'COMPLETED') {
            return res.status(400).json({ error: 'Payment verification failed' });
        }

        // Ethers.js setup
        const MNEMONIC = process.env.MNEMONIC;
        const RPC_URL = process.env.RPC_URL;
        const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        const wallet = ethers.Wallet.fromMnemonic(MNEMONIC).connect(provider);

        const contractAddress = process.env.CONTRACT_ADDRESS; // Replace with your contract address
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
        try {
            const tx = await contract.executeMetaTransaction(userAddress, functionSignature, v, r, s, {
                gasPrice: ethers.utils.parseUnits('20', 'gwei'),
                gasLimit: 100000
            });

            await tx.wait();
            res.json({ status: 'Transaction confirmed' });
        } catch (transactionError) {
            console.error('Error executing meta-transaction:', transactionError);
            res.status(500).json({ status: 'Error executing meta-transaction', error: transactionError.message });
        }
    } catch (error) {
        console.error('Transaction failed, payment ID mismatch:', error);
        const errorText = error.response ? await error.response.text() : error.message;
        res.status(500).json({ status: 'Transaction failed, payment ID mismatch', error: errorText });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
