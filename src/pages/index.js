import { useState, useEffect } from "react";
import Web3 from "web3";

import contractAbi from "../contractAbi/Web3ClubsToken.json"
const contractAddress = "0x058733ecFf0EC820FeF767fa196108FF7e427E21"

export default function Home() {
  const [account, setAccount] = useState(null);
  const [constractData, setContractData] = useState()
  const [tokenName, setTokenName] = useState(null)

  useEffect(() => {
    const getAccount = async () => {
      try {
        const web3 = new Web3(window.ethereum)
        const accounts = await web3.eth.getAccounts()

        console.log("Metamask Wallets", accounts)

        setAccount(accounts[0])
      } catch (error) {
        if (error.message === "User denied account authorizatio")
          console.log("User denied account authorization")
        else if (error.message === "MetaMask is not enabled") {
          // add link to download metamask
          console.log(error)
        } else {
          console.log
        }
      }
    }

    getAccount()
    .catch(console.error)
  }, [])

  //contract
  const getContractData = async () => {
    try{
      const web3 = new Web3(window.ethereum)
      const tokenData = new web3.eth.Contract(
        contractAbi.abi,
        contractAddress
      )
      //set token name
      // const name = await tokenData.methods.tokenName().call()


      console.log(tokenData)

      setContractData(tokenData)
    } catch (error){
      console.log(error);
    }
  }

  // get contract name
  const getContractName = async () => {
    try{
      const tokenName = await constractData.method.tokenName.call()
      console.log(tokenName)
      setTokenName(tokenName)
    } catch (error) {
      console.log("our error here", error)
    }
  }

  return (
    <div className="container min-h-screen flex-col items-center justify-between p-24">

      {!account ? (
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
              onClick={() => window.ethereum.enable()}>Connet To MetaMask</button>

      ): null}

      {account ? (
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold">Your Account</h1>
          <p className="text-2xl">{account}</p>

          <button onClick={getContractData} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded">
          Get Token Data
          </button>
          <br />
          <button onClick={getContractName} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded">
          Display the Token Name
          </button>
          {/* display token name here*/}
          <h1 className="text-4xl font-bold">
          {tokenName}
          </h1>

          </div>
      ): null}
    </div>
  )
}
