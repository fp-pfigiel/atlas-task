import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FactoryModule = buildModule("FactoryModule", (builder) => {
  const factory = builder.contract("Factory");

  return { factory };
});

export default FactoryModule;
