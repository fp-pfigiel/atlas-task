import "dotenv/config";
import { ethers } from "ethers";
import FactoryArtifacts from "../ignition/deployments/chain-31337/artifacts/FactoryModule#Factory.json";

// Defining only utilized props, more are actually present.
interface StructLog {
  op: string;
  pc: number;
  depth: number;
}

const formatAddress = (rawAddress: string) => `0x${rawAddress.slice(24)}`;

const execute = async () => {
  const factoryAddress = process.env.FACTORY_ADDRESS;

  if (!factoryAddress) {
    throw new Error("No factory address defined in the .env file, aborting.");
  }

  const provider = new ethers.JsonRpcProvider("http://localhost:8545");
  const signer = await provider.getSigner();
  const factory = new ethers.Contract(
    factoryAddress,
    FactoryArtifacts.abi,
    signer
  );

  const { hash: txHash } = await factory.produce();
  const { structLogs, returnValue } = await provider.send(
    "debug_traceTransaction",
    [txHash]
  );
  const createOp = structLogs.find((log: StructLog) => log.op === "CREATE");
  const nextOp = structLogs.find(
    (log: StructLog) => log.pc === createOp.pc + 1 && log.depth === 1
  );
  const contractAddress = nextOp.stack[nextOp.stack.length - 1];

  console.log(
    `Contract address from return value: ${formatAddress(returnValue)}`
  );
  console.log(`Contract address from trace: ${formatAddress(contractAddress)}`);

  if (contractAddress === returnValue) {
    console.log("Addresses match, test successful!");
  } else {
    console.log("Addresses don't match, test failed!");
  }
};

execute();
