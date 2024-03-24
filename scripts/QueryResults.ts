// QueryResults.ts
import { createPublicClient, http, hexToString, Address } from "viem";
import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";

dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";

async function queryWinningProposal(contractAddress: string) {
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  console.log("Querying winning proposal...");
  const winnerNameHex = (await publicClient.readContract({
    address: contractAddress as Address,
    abi,
    functionName: "winnerName",
    args: [],
  })) as `0x${string}`;

  const winnerName = hexToString(winnerNameHex, { size: 32 });
  console.log("Winning proposal name:", winnerName);
}

async function main() {
  const parameters = process.argv.slice(2);
  if (parameters.length !== 1) {
    throw new Error(
      "Invalid number of parameters. Usage: node QueryResults.ts <contractAddress>"
    );
  }
  const contractAddress = parameters[0] as string;
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
    throw new Error("Invalid contract address format.");
  }

  await queryWinningProposal(contractAddress);
}

main().catch((error) => {
  console.error("Error occurred:", error.message);
  process.exitCode = 1;
});
