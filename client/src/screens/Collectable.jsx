import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import { createClient } from "urql";
import Masonry from "react-masonry-css";
import Modal from "react-modal";

const Collectable = ({ web3, account, nft, market }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const APIURL = "https://api.studio.thegraph.com/query/5764/shillzilla/v0.0.1";
  const [open, setOpen] = useState(undefined);
  const [sellItem, setSellItem] = useState({});

  const tokensQuery = `
    query {
      users(where: { id: "${account[0].toLowerCase()}" } ) {
        id
        tokens {
          id
          tokenID
          contentURI
          creator{
            id
          }
          owner{
            id
          }
          
        }
      }
    }
  
  `;

  const client = createClient({
    url: APIURL,
  });

  async function fetchData() {
    let data = await client.query(tokensQuery).toPromise();

    if (data.data.users[0]) {
      let tokenData = await Promise.all(
        data.data.users[0].tokens.map(async (token) => {
          let meta;
          let tokenURI;
          if (token.contentURI.startsWith("ipfs://")) {
            tokenURI = token.contentURI.replace(
              "ipfs://",
              "https://ipfs.infura.io/ipfs/"
            );
          } else {
            tokenURI = token.contentURI;
          }
          try {
            const metaData = await fetch(tokenURI);
            let response = await metaData.json();
            meta = response;
          } catch (err) {}
          if (!meta) return;
          token.meta = meta;
          return token;
        })
      );
      return tokenData;
    } else {
      return null;
    }
  }

  async function sell(id) {
    setOpen(id);
  }

  const addMarket = async (id, price) => {
    market.methods
      .listOnMarket(nft.options.address, id, price)
      .send({ from: account[0], type: "0x2" })
      .on("confirmation", (reciept) => {
        setLoading(false);
        window.location.reload();
      });
  };

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "#cec8c86a",
      padding: 0,
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(27, 27, 27, 0.445)",
    },
  };

  Modal.setAppElement("#root");

  useEffect(() => {
    setLoading(true);
    const init = async () => {
      const data = await fetchData();
      setData(data);
      setLoading(false);
    };
    init();
  }, []);

  console.log(data);

  return loading ? (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "90vh" }}
    >
      <Loader type="ThreeDots" color="#6e1cf1" height={80} width={80} />
    </div>
  ) : (
    <div>
      <div className="container">
        <div className="d-flex justify-content-center my-5">
          <h1>My Collections</h1>
        </div>
        <Masonry
          breakpointCols={{ default: 4, 800: 2, 400: 1 }}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {data?.map((item) => (
            <div key={item.id}>
              <div className="box p-3 overflow-hidden">
                <img
                  href={item?.meta?.image}
                  className="img-fluid"
                  src={item?.meta?.image}
                  alt=""
                />
                <h4 className="my-2">{item?.meta?.name}</h4>
                <h6>
                  Owner : <small>{account[0]}</small>
                </h6>
                <button className="baton" onClick={() => sell(item.id)}>
                  Sell
                </button>

                {/* Modal Add to Market */}

                <Modal
                  isOpen={open === item.id}
                  onRequestClose={() => {
                    setOpen(undefined);
                  }}
                  style={customStyles}
                  contentLabel="Example Modal"
                >
                  <div
                    className="box p-3 overflow-hidden mt-0"
                    style={{
                      width: "380px",
                    }}
                  >
                    <img
                      href={item?.meta?.image}
                      className="img-fluid"
                      src={item?.meta?.image}
                      alt=""
                    />
                    <h4 className="my-2">{item?.meta?.name}</h4>
                    <h6>
                      Owner : <small>{account[0]}</small>
                    </h6>
                    <button className="baton" onClick={() => sell(item.id)}>
                      Sell
                    </button>
                  </div>
                  <form
                    className="row form-group mx-2 mt-2 justify-content-between"
                    onSubmit={async (event) => {
                      event.preventDefault();
                      const price = sellItem.value;
                      const itemId = sellItem.id;
                      console.log(price);

                      await addMarket(itemId, price);
                    }}
                  >
                    <input
                      className="col-md-7 form-control"
                      id={`price-${item.id}`}
                      type="number"
                      step="0.00001"
                      min="0.00001"
                      onChange={(e) => {
                        setSellItem({ value: e.target.value, id: item.id });
                      }}
                    />
                    <button className="col-md-4 baton" type="submit">
                      Add to Market
                    </button>
                  </form>
                </Modal>

                {/* Modal End */}
              </div>
            </div>
          ))}
        </Masonry>
      </div>
    </div>
  );
};

export default Collectable;
