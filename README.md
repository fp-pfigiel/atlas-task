# Project Atlas verification task

This project demonstrates the solution to the verification task for the Atlas project, being:

> How would you get a newly created contract address, in case the contract is created via another factory contract, and thus the transaction in which it is created does not have the "to" field as NULL, and neither the "input" field contains its bytecode? Hint – look through transaction traces.

## Primary solution (transaction trace)

The primary solution relies on the opcodes contained within the transaction's trace. Given the transaction hash, it is possible to obtain the full list of sub-calls performed by the transaction. The opcode responsible for creating a contract is CREATE, which returns the address of the new instance. In order to get this address, we need to look at the execution stack, as the address will be on top of it. This can be done by examining the stack of the next instruction after CREATE, i.e. the opcode with the greater program counter.

The described solution has been implemented in this project.

### Pre-requisites

Ensure that the following CLI tools are available on your system:

- node v18.x
- yarn

### Quick start

1. Clone this repository:
   ```bash
   git clone https://github.com/fp-pfigiel/atlas-task.git
   ```
2. Install the packages:
   ```bash
   yarn
   ```
3. Compile smart contracts:
   ```bash
   yarn compile
   ```
4. In a separate console window, run local hardhat node:
   ```bash
   yarn run-node
   ```
5. Deploy smart contracts to the local network:
   ```bash
   yarn deploy
   ```
6. Populate the `.env` file. Look at `.env.sample` file for guidance.
7. Run the test, the results will be shown in the console:
   ```bash
   yarn start
   ```

### Limitations & alternatives

In order for the solution to work, the node needs to have transaction tracing enabled, which may not be the case for all networks. It is also possible to determine the address without writing code, by examining tx traces using an explorer which supports them, like Etherscan.

## Secondary solution (address calculation)

Another way to obtain the address of a contract created by a factory could be to manually calculate it. The addresses for contract instances in EVM are deterministically derived from the sender address (in this case the factory contract) and the sender's nonce, according to the formula:

`address = keccak256(rlp([sender_address,sender_nonce]))[12:]`,

where `keccak256` is the hashing function, `rlp` is the RLP serialization function and `[12:]` indicates skipping the first 12 bytes of the result. This solution can even be used to obtain the hash of the contract before its creation. Below is a pseudo/TS code demonstrating a theoretical implementation:

```typescript
const provider = new ethers.JsonRpcProvider("network-address");
const tx = await provider.getTransaction(txHash);
const nonce = await provider.getTransactionCount(tx.from);
const address = keccak256(RLP.encode(factoryAddress, nonce)).slice(24);
```
