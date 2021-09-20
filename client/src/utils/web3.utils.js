import Web3 from "web3";
import SHILLIN from "../contracts/SHILLIN.json";
import SHILLINMarket from "../contracts/SHILLINMarket.json";
import detectEthereumProvider from "@metamask/detect-provider";

// Metamask Intrigation

const getWeb3 = () =>
  new Promise(async (resolve, reject) => {
    let provider = await detectEthereumProvider();

    if (provider) {
      await provider.request({ method: "eth_requestAccounts" });

      try {
        const web3 = new Web3(window.ethereum);

        resolve(web3);
      } catch (error) {
        reject(error);
      }
    }
    reject("Install Metamask");
  });

const getNft = async (web3) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = await SHILLIN.networks[networkId];
  return new web3.eth.Contract(SHILLIN.abi, deployedNetwork?.address);
};

const getMarket = async (web3) => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = await SHILLINMarket.networks[networkId];
  return new web3.eth.Contract(SHILLINMarket.abi, deployedNetwork?.address);
};

export { getWeb3, getNft, getMarket };
