import { useState, useEffect } from "react";
import Web3 from "web3";


export default function Home() {
  const [account, setAccount] = useState(null);

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

          </div>
      ): null}
    </div>
  )
}
