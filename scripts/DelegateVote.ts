// DelegateVote.ts
import { createPublicClient, http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";

dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function delegateVote(
  contractAddress: `0x${string}`,
  toAddress: `0x${string}`
) {
  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  const voterClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  console.log(`Delegating vote to address ${toAddress}`);

  const transactionHash = await voterClient.writeContract({
    address: contractAddress,
    abi,
    functionName: "delegate",
    args: [toAddress],
  });

  console.log(`Transaction hash: ${transactionHash}`);
  console.log("Waiting for confirmation...");

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: transactionHash,
  });
  console.log("Transaction confirmed. Receipt:", receipt);
}

async function main() {
  const parameters = process.argv.slice(2);
  if (parameters.length < 2) {
    throw new Error(
      "Insufficient parameters provided. Usage: node DelegateVote.ts <contractAddress> <toAddress>"
    );
  }

  const contractAddress = parameters[0] as `0x${string}`;
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
    throw new Error("Invalid contract address format.");
  }

  const toAddress = parameters[1] as `0x${string}`;
  if (!/^0x[a-fA-F0-9]{40}$/.test(toAddress)) {
    throw new Error("Invalid to address format.");
  }

  await delegateVote(contractAddress, toAddress);
}

main().catch((error) => {
  console.error("Error occurred:", error.message);
  process.exitCode = 1;
});
