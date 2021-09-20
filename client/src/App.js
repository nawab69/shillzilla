import React, { useEffect, useState } from "react";
import { getMarket, getNft, getWeb3 } from "./utils/web3.utils.js";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Dashboard, Marketplace, Terms } from "./screens";
import Navbar from "./components/Navbar.jsx";
import Loader from "react-loader-spinner";
import Collectable from "./screens/Collectable.jsx";

const App = () => {
  const [web3, setWeb3] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [nft, setNft] = useState(undefined);
  const [market, setMarket] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const account = await web3.eth.getAccounts();
      const nft = await getNft(web3);
      const nftMarket = await getMarket(web3);
      setWeb3(web3);
      setAccount(account);
      setNft(nft);
      setMarket(nftMarket);
    };
    init();
  }, []);

  if (typeof web3 === "undefined" || typeof account === "undefined") {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "90vh" }}
      >
        <Loader type="ThreeDots" color="#6e1cf1" height={80} width={80} />
      </div>
    );
  } else {
    return (
      <>
        <Router>
          <Navbar account={account[0]} />
          <Route
            path="/"
            component={() => (
              <Dashboard web3={web3} nft={nft} account={account} />
            )}
            exact
          />
          <Route
            path="/collectable"
            component={() => (
              <Collectable
                web3={web3}
                nft={nft}
                account={account}
                market={market}
              />
            )}
            exact
          />
          <Route
            path="/marketplace"
            component={() => (
              <Marketplace
                market={market}
                web3={web3}
                nft={nft}
                account={account}
              />
            )}
            exact
          />
          <Route
            path="/terms-and-conditions"
            component={() => <Terms account={account} />}
            exact
          />
        </Router>
      </>
    );
  }
};

export default App;
