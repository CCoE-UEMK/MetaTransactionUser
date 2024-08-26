// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MetaTransactionVerifier {
    event MetaTransactionExecuted(address userAddress, bytes32 messageHash);

    function executeMetaTransaction(
        address userAddress,
        bytes32 messageHash,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public returns (bool) {
        require(verify(userAddress, messageHash, v, r, s), "Invalid signature");

        emit MetaTransactionExecuted(userAddress, messageHash);

        // Add any other logic you want to execute after verification

        return true;
    }

    function verify(
        address userAddress,
        bytes32 messageHash,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public pure returns (bool) {
        // Recreate the message hash that was signed on the client side
        bytes32 prefixedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash));
        
        // Recover the signer address from the signature
        return ecrecover(prefixedHash, v, r, s) == userAddress;
    }
}