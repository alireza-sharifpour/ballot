import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import { viem } from "hardhat";

describe("HelloWorld", function () {
  describe("HelloWorld", function () {
    async function deployContractFixture() {
      // https://hardhat.org/hardhat-runner/docs/advanced/using-viem#clients
      const publicClient = await viem.getPublicClient();
      const [owner, otherAccount] = await viem.getWalletClients();
      // https://hardhat.org/hardhat-runner/docs/advanced/using-viem#contracts
      const helloWorldContract = await viem.deployContract("HelloWorld");
      // https://www.typescriptlang.org/docs/handbook/2/functions.html#parameter-destructuring
      return {
        publicClient,
        owner,
        otherAccount,
        helloWorldContract,
      };
    }

    it("Should give a HelloWorld", async function () {
      const { helloWorldContract } = await loadFixture(deployContractFixture);
      const text = await helloWorldContract.read.helloWorld();
      expect(text).to.equal("Hello World");
    });
    it("Should change text correctly", async function () {
      const helloWorldContract = await viem.deployContract("HelloWorld");
      await helloWorldContract.write.setText(["Hello World 2"]);
      const text = await helloWorldContract.read.helloWorld();
      expect(text).to.equal("Hello World 2");
    });
    it("Should set owner to deployer account", async function () {
      const { helloWorldContract, owner } = await loadFixture(
        deployContractFixture
      );
      // https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-viem#contracts
      const contractOwner = await helloWorldContract.read.owner();
      // https://www.chaijs.com/api/bdd/#method_equal
      expect(contractOwner.toLowerCase()).to.equal(owner.account.address);
    });
  });
});
