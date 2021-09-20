import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import Masonry from "react-masonry-css";
import Modal from "react-modal";
import { createClient } from "urql";

const Marketplace = ({ market, nft, web3, account }) => {
  const [items, setItems] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const APIURL = "https://api.studio.thegraph.com/query/5764/shillzilla/v0.0.1";
  const client = createClient({
    url: APIURL,
  });

  useEffect(() => {
    setLoading(true);
    const init = async () => {
      if (market) {
        const data = await market.methods.fetchMarketItems().call({
          from: account[0],
        });

        const newData = data.map(async (item) => {
          if (item.nftContract === nft.options.address) {
            console.log(true);
            const tokensQuery = `
                query {
                    tokens(where: { tokenID : "${item.tokenId}"}) {
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
              
              `;
            let data = await client.query(tokensQuery).toPromise();
            console.log(data);
          }
        });

        setItems(data);
        console.log(data);
        setLoading(false);
      }
    };
    init();
  }, [market, account, nft]);

  if (items === undefined) {
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
      <div className="container">
        <div className="d-flex justify-content-center my-5">
          <h1>My Collections</h1>
        </div>
        <Masonry
          breakpointCols={{ default: 4, 800: 2, 400: 1 }}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {items?.map((item) => (
            <div key={item.id}>
              <div className="box p-3 overflow-hidden">
                <img
                  href={item?.meta?.image}
                  className="img-fluid"
                  src={item?.meta?.image}
                  alt=""
                />
                <h6 className="my-2">{web3.utils.fromWei(item.price)}</h6>
                <h4 className="my-2">{item?.meta?.name}</h4>
                <h6>
                  Seller : <small>{item.seller}</small>
                </h6>
                <button className="baton" onClick={() => {}}>
                  Buy
                </button>

                {/* Modal Add to Market */}

                {/* <Modal
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

                Modal End */}
              </div>
            </div>
          ))}
        </Masonry>
      </div>
    );
  }
};

export default Marketplace;
