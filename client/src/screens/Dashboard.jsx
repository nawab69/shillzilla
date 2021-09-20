import React, { useState } from "react";
import Loader from "react-loader-spinner";
import { create } from "ipfs-http-client";

const Dashboard = ({ web3, nft, account }) => {
  const client = create("https://ipfs.infura.io:5001/api/v0");

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [stream, setStream] = useState();
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("image");
  const [checked, setChecked] = useState(false);

  console.log(nft);

  const submitForm = async () => {
    setLoading(true);
    const added = await client.add(stream);
    const doc = JSON.stringify({
      description: description,
      external_url: "https://onxi.io/",
      image: `https://ipfs.infura.io/ipfs/${added.path}`,
      file: `https://ipfs.infura.io/ipfs/${added.path}`,
      name: title,
      category: category,
    });

    const uri = await client.add(doc);

    const receipt = await nft.methods
      .mint(`https://ipfs.infura.io/ipfs/${uri.path}`, "5")
      .send({
        from: account[0],
        type: "0x2",
      });

    console.log(receipt);

    setLoading(false);
  };

  const captureFile = (event) => {
    event.preventDefault();
    setStream(event.target.files[0]);
  };

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
        <div class="form-wrapper">
          <form
            className="box box--1"
            onSubmit={(event) => {
              event.preventDefault();
              if (checked && title && description && stream && category) {
                submitForm();
              } else {
                window.alert("Please fill all the required fields");
              }
            }}
          >
            <h1 className="text-center mt-0 mb-5">Mint your NFT</h1>
            <div className="row form-group mb-3">
              <label for="formFile" class="col-3 form-level">
                Select Your File
              </label>
              <div className="col-9">
                <input
                  id="formFile"
                  className="col-9 form-control"
                  type="file"
                  onChange={captureFile}
                />
              </div>
            </div>
            <div className="row form-group mb-3">
              <label htmlFor="title" class="col-3 form-label">
                Give a title of your NFT
              </label>
              <div className="col-9">
                <input
                  id="title"
                  type="text"
                  className="form-control"
                  placeholder="Title"
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                  required
                />
              </div>
            </div>

            <div className="row form-group mb-3">
              <label htmlFor="title" class="col-3 form-label">
                Description
              </label>
              <div className="col-9">
                <textarea
                  onChange={(e) => {
                    setDescription(e.target.value);
                    console.log(e.target.value);
                  }}
                  required
                ></textarea>
              </div>
            </div>

            <div className="row form-group">
              <div className="col-3">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="terms"
                  defaultChecked={checked}
                  onChange={(e) => {
                    setChecked(!checked);
                  }}
                />
                <label class="form-check-label" htmlFor="terms">
                  I accept the Terms and Conditions
                </label>
              </div>
              <div className="col-9">
                <textarea readOnly>T & C Here</textarea>
              </div>
            </div>

            {!loading ? (
              <button type="submit" className="baton">
                Mint
              </button>
            ) : (
              <Loader type="ThreeDots" color="#00BFFF" height={80} width={80} />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
