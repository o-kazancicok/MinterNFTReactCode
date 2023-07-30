import React, { useState } from "react";
import Web3 from "web3";
import NFTContractABI from "./NFTContractABI";
import NFTContractAddress from "./NFTContractAddress";

const MinterPage = () => {
  const [name, setName] = useState("");
  const [itemPreview, setItemPreview] = useState(null); 
  const [metaData, setMetaData] = useState([{ key: "", value: "" }]);
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setItemPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleMetaDataChange = (index, field, value) => {
    const updatedMetaData = [...metaData];
    updatedMetaData[index][field] = value;
    setMetaData(updatedMetaData);
  };

  const handleMint = async () => {
    // Initialize Web3
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];

        // Get the contract instance
        const contract = new web3.eth.Contract(
          NFTContractABI,
          NFTContractAddress
        );

        // Upload the NFT file to off-chain storage (e.g., IPFS)
        const tokenURI = await uploadFileToIPFS(file);

        // Call the smart contract's mintNFT function
        await contract.methods
          .mintNFT(name, tokenURI, parseInt(price))
          .send({ from: account });
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log({ name, itemPreview, metaData, price });
    }
  };

  // Function to upload the NFT file to off-chain storage using a public IPFS gateway
  const uploadFileToIPFS = async (file) => {
    const apiUrl = "https://ipfs.infura.io:5001/api/v0/add"; 
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data && data.Hash) {
        return `https://ipfs.infura.io/ipfs/${data.Hash}`;
      } else {
        console.error("Error uploading file to IPFS:", data);
        return null;
      }
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
      return null;
    }
  };

  return (
    <div>
      <h1>NFT Minter</h1>

      {/* General Info Section */}
      <div>
        <h2>General Info</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {itemPreview && <img src={itemPreview} alt="Item Preview" />}{" "}
        {/* Display the item preview if available */}
      </div>

      {/* Meta Data Section */}
      <div>
        <h2>Meta Data</h2>
        {metaData.map((data, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Key"
              value={data.key}
              onChange={(e) =>
                handleMetaDataChange(index, "key", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Value"
              value={data.value}
              onChange={(e) =>
                handleMetaDataChange(index, "value", e.target.value)
              }
            />
          </div>
        ))}
        <button onClick={handleAddMetaData}>+</button>
      </div>

      {/* Price Input Section */}
      <div>
        <h2>Price</h2>
        <input
          type="number"
          placeholder="Amount"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      {/* Mint Button */}
      <button onClick={handleMint}>Mint</button>
    </div>
  );
};

export default MinterPage;
