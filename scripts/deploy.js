const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Specify the fully qualified name of the contract
    const SimpleMetaTransaction = await hre.ethers.getContractFactory("contracts/SimpleMetaTransaction.sol:SimpleMetaTransaction");
    const contract = await SimpleMetaTransaction.deploy();
    await contract.deployed();

    console.log("Contract deployed to:", contract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

