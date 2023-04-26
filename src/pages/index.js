import { useState, useEffect } from "react";
import Web3 from "web3";

import contractAbi from "../contractAbi/Web3ClubsToken.json";
const contractAddress = "0x058733ecFf0EC820FeF767fa196108FF7e427E21";

export default function Home() {
  const [account, setAccount] = useState(null);
  const [contractData, setContractData] = useState();
  const [token_Name, setTokenName] = useState(null);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState(0);

  /* `useEffect` is a React hook that allows us to perform side effects in functional components. In
  this case, the `useEffect` hook is used to get the user's account using the `getAccount` function
  when the component mounts. The empty array `[]` as the second argument to `useEffect` ensures that
  the effect is only run once when the component mounts. The `getAccount` function uses the `Web3`
  library to get the user's accounts from the MetaMask wallet and sets the first account to the
  `account` state using the `setAccount` function. If there is an error, it is caught and logged to
  the console. */
  useEffect(() => {
    const getAccount = async () => {
      try {
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();

        console.log("Metamask Wallets", accounts);

        setAccount(accounts[0]);
      } catch (error) {
        if (error.message === "User denied account authorizatio")
          console.log("User denied account authorization");
        else if (error.message === "MetaMask is not enabled") {
          // add link to download metamask
          console.log(error);
        } else {
          console.log;
        }
      }
    };

    getAccount().catch(console.error);
  }, []);

  //contract
  const getContractData = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const tokenData = new web3.eth.Contract(contractAbi.abi, contractAddress);
      //set token name
      const balance = await tokenData.methods.balanceOf(account).call();

      console.log(tokenData);
      console.log(balance);

      setContractData(tokenData);
    } catch (error) {
      console.log(error);
    }
  };

  // get contract name
  const getContractName = async () => {
    try {
      if (contractData) {
        const token_Name = await contractData.methods.token_Name().call();
        console.log(token_Name);
        setTokenName(token_Name);
      } else {
        console.log("Contract data is not available yet");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  /**
   * The function handles a transfer of tokens using the Web3 library and logs the transaction hash and
   * URL.
   */
  const handleTransfer = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const tokenData = new web3.eth.Contract(contractAbi.abi, contractAddress);
      const transferAmountWei = web3.utils.toWei(
        transferAmount.toString(),
        "ether"
      ); // convert to wei
      const tx = await tokenData.methods
        .transfer(recipientAddress, transferAmountWei)
        .send({ from: account });
      console.log(tx);
      const txHash = tx.transactionHash;
      const txURL = `https://sepolia.etherscan.io/tx/${txHash}`;
      console.log(txURL);
      document.getElementById("tx-url").innerHTML = txURL; // update tx-url div content
    } catch (error) {
      console.log("You have not placed all the parameters", error);
    }
  };

  return (
    <div className="container min-h-screen flex-col items-center justify-between p-24">
      {!account ? (
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          onClick={() => window.ethereum.enable()}
        >
          Connet To MetaMask
        </button>
      ) : null}

      {account ? (
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold">Your Account</h1>
          <p className="text-2xl">{account}</p>

          <button
            onClick={getContractData}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Get Token Data
          </button>
          <br />
          <button
            onClick={getContractName}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Display the Token Name
          </button>
          {/* display token name here*/}
          <h1 className="text-4xl font-bold">{token_Name}</h1>
        </div>
      ) : null}
      <br />
      <div className="flex flex-col items-center">
        <label>Recipient Address</label>
        <br />
        <input
          className="border border-gray-400 p-2 mb-2 rounded-lg w-64 text-red-700"
          type="text"
          placeholder="Recipient Address"
          value={recipientAddress}
          onChange={(event) => setRecipientAddress(event.target.value)}
        />
        <br />
        <label>Transfer Amount</label>
        <br />
        <input
          className="border border-gray-400 p-2 mb-2 rounded-lg w-64 text-blue-500"
          type="number"
          placeholder="Transfer Amount"
          value={transferAmount}
          onChange={(event) => setTransferAmount(event.target.value)}
        />
        <br />
        <button
          onClick={handleTransfer}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
        >
          Transfer Tokens
        </button>
        <br />
        <div id="tx-url"></div>
      </div>
    </div>
  );
}
