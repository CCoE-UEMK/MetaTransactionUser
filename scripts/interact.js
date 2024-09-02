const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
    const MNEMONIC = process.env.MNEMONIC;
    const RPC_URL = process.env.RPC_URL;

    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const wallet = ethers.Wallet.fromMnemonic(MNEMONIC).connect(provider);

    const userAddress = "0xa6defa458fe88eba0e0e9c0e1efa203afbbc64d4"; // Replace with actual user address
    const contractAddress = "0xe06E5d5458066CD89843D604DA5a0a687f1D63ab"; // Replace with actual contract address

    const abi = [
        "function executeMetaTransaction(address userAddress, bytes memory functionSignature, uint8 v, bytes32 r, bytes32 s) public payable returns (bytes memory)",
        "function exampleFunction(string memory message) public pure returns (string memory)"
    ];
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    // Generate the function signature
    const functionSelector = ethers.utils.id("exampleFunction(string)").slice(0, 10);
    const encodedParameters = ethers.utils.defaultAbiCoder.encode(["string"], ["Hello from meta-transaction"]).slice(2);
    const functionSignature = functionSelector + encodedParameters;
    console.log("Function Signature:", functionSignature);

    // Create the message hash
    const messageHash = ethers.utils.solidityKeccak256(
        ["address", "bytes"],
        [userAddress, functionSignature]
    );
    console.log("Message Hash:", messageHash);

    // Sign the message hash using SigningKey
    const signingKey = new ethers.utils.SigningKey(wallet.privateKey);
    const signature = signingKey.signDigest(messageHash);

    // Extract v, r, s from the signature
    const { v, r, s } = signature;

    console.log("Signature v:", v);
    console.log("Signature r:", r);
    console.log("Signature s:", s);

    // Verify the recovered address
    const recoveredAddress = ethers.utils.recoverAddress(messageHash, signature);
    console.log("Recovered Address:", recoveredAddress);

    if (recoveredAddress.toLowerCase() === userAddress.toLowerCase()) {
        console.log("The recovered address matches the user address.");
    } else {
        console.log("The recovered address does not match the user address.");
    }

    try {
        // Execute meta-transaction with specified gas price and limit
        const tx = await contract.executeMetaTransaction(userAddress, functionSignature, v, r, s, {
            gasPrice: ethers.utils.parseUnits('20', 'gwei'), // Adjust as necessary
            gasLimit: 100000 // Adjust as necessary
        });
        console.log("Transaction sent. Waiting for confirmation...");

        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);
    } catch (error) {
        console.error("Error executing meta-transaction:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("An error occurred:", error);
        process.exit(1);
    });

