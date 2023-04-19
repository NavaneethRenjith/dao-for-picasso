import * as fs from "fs"
import { network, ethers } from "hardhat"
import { proposalsFile, developmentChains, VOTING_PERIOD } from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"


async function main() {
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
  // Get the last proposal for the network. You could also change it for your index
  const proposalId = proposals[network.config.chainId!].at(-1);
  // 0 = Against, 1 = For, 2 = Abstain for this example
  const voteWay = 1
  const reason = "I support"
  //! Add userAddress here
  // const userAddress = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
  const userAddress = "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
  await vote(proposalId, voteWay, reason, userAddress)
}

// 0 = Against, 1 = For, 2 = Abstain for this example
export async function vote(proposalId: string, voteWay: number, reason: string, userAddress: string) {
  console.log("Voting...")
  const governor = await ethers.getContract("GovernorContract")
  const signer = await ethers.provider.getSigner(userAddress)
  const governorWithSigner = governor.connect(signer)

  //! How many tokens should a user have to be able to vote?
  // const balance = await governor.token().balanceOf(userAddress)
  // if (balance.lt(governor.proposalThreshold())) {
  //   console.log("User does not have enough tokens to vote on proposal.")
  //   return
  // }

  const voteTx = await governorWithSigner.castVoteWithReason(proposalId, voteWay, reason)
  const voteTxReceipt = await voteTx.wait(1)
  console.log(voteTxReceipt.events[0].args.reason)
  const proposalState = await governor.state(proposalId)
  // if (voteWay == 0)
  //   console.log('Vote: Against')
  // if (voteWay == 1)
  //   console.log('Vote: For')
  console.log(`Current Proposal State: ${proposalState}`)

  //   if (developmentChains.includes(network.name)) {
  //     await moveBlocks(VOTING_PERIOD + 1)
  //   }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
