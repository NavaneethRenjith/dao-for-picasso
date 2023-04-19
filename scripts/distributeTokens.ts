import { ethers } from "hardhat";
import { BigNumber } from "ethers";

async function main() {
    // const governanceTokenAddress = "YOUR_GOVERNANCE_TOKEN_ADDRESS_HERE";
    const governanceTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const [account1, account2] = await ethers.getSigners();
    const userAddress1 = await account1.getAddress();
    const userAddress2 = await account2.getAddress();
    const recipients = [
        "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    ];
    // const recipients = [
    //     userAddress1,
    //     userAddress2,
    // ];

    const amounts = [
        BigNumber.from("2000000000000000000"), // 2 tokens
        BigNumber.from("2000000000000000000"), // 2 tokens

    ];

    // Get the GovernanceToken contract instance
    const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
    const governanceToken = await GovernanceToken.attach(governanceTokenAddress);

    // Mint and distribute tokens
    for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i];
        const amount = amounts[i];

        await governanceToken.mintFor(recipient, amount);
        console.log(`Transferred ${amount.toString()} tokens to ${recipient}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
