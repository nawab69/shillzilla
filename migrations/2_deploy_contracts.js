const SHILLIN = artifacts.require("SHILLIN");
const SHILLINMarket = artifacts.require("SHILLINMarket");

module.exports = async function (deployer, _network, accounts) {
  await deployer.deploy(SHILLIN);
  const SHILLINNFT = await SHILLIN.deployed();

  await deployer.deploy(SHILLINMarket);
  const SHILLINMARKET = await SHILLINMarket.deployed();

  await SHILLINNFT.setMarketPlace(SHILLINMARKET.address);
};
