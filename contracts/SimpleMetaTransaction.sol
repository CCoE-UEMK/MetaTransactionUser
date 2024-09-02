// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleMetaTransaction {
    event MetaTransactionExecuted(address userAddress, address relayerAddress, bytes functionSignature);

    function executeMetaTransaction(
        address userAddress,
        bytes memory functionSignature,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public payable returns (bytes memory) {
        // Construct the message hash for verification
        bytes32 messageHash = getMessageHash(userAddress, functionSignature);
        
        // Verify the signature
        address signer = ecrecover(messageHash, v, r, s);
        require(signer == userAddress, "Invalid signature");

        // Execute the function call
        (bool success, bytes memory result) = address(this).call(functionSignature);
        require(success, "Function call failed");

        emit MetaTransactionExecuted(userAddress, msg.sender, functionSignature);
        return result;
    }

    // Helper function to get the message hash
    function getMessageHash(address userAddress, bytes memory functionSignature) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(userAddress, functionSignature));
    }

    // Example function that can be called via meta-transaction
    function exampleFunction(string memory message) public pure returns (string memory) {
        return message;
    }
}

