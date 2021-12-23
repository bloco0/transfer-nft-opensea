require('dotenv').config(); 
const Web3 = require('web3');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require('fs');
const csv = require('csv-parser');
const abi = require('./abi');

const MNEMONIC = process.env.MNEMONIC;
const NODE_API_KEY = process.env.INFURA_KEY
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;
const API_KEY = process.env.API_KEY || ""; // API key is optional but useful if you're doing a high volume of requests.
const TOKEN_ID = process.env.TOKEN_ID;

if (!MNEMONIC || !NODE_API_KEY || !NETWORK || !OWNER_ADDRESS) {
  console.error(
    "Please set a mnemonic, Alchemy/Infura key, owner, network, API key, nft contract, and factory contract address."
  );
  return;
}

if (!NFT_CONTRACT_ADDRESS) {
  console.error("Please either set a factory or NFT contract address.");
  return;
}

let provider = new HDWalletProvider({
    mnemonic: MNEMONIC,
    providerOrUrl: `https://${NETWORK}.infura.io/v3/${NODE_API_KEY}`,
    addressIndex: 0
  });
var web3 = new Web3(provider);

var nftContract = new web3.eth.Contract(abi.openseaAbi, NFT_CONTRACT_ADDRESS);

async function main() {
  console.log("begin");
  
  fs.createReadStream('wallets.csv')
    .pipe(csv())
    .on('data', async (destWallet) => {
      console.log(destWallet.wallets)
      let qtyOwner = await nftContract.methods.balanceOf(OWNER_ADDRESS, TOKEN_ID).call()
      let qtyDest = await nftContract.methods.balanceOf(destWallet.wallets, TOKEN_ID).call()
      console.log(`Wallet ${destWallet.wallets} qty ${qtyDest}`)
      
      if (qtyOwner > 0 && qtyDest == 0){
          try{
              let gasPrice = await web3.eth.getGasPrice();
              let gas = await nftContract.methods.safeTransferFrom(OWNER_ADDRESS, destWallet.wallets, TOKEN_ID, 1, "0x0")
              .estimateGas({ from: OWNER_ADDRESS });

              await nftContract.methods.safeTransferFrom(OWNER_ADDRESS, destWallet.wallets, TOKEN_ID, 1, "0x0")
              .send({ from: OWNER_ADDRESS, gas: gas, gasPrice: gasPrice })
              .then(function(tx){
                  console.log("TX: ", tx);
              })
          } 
          catch(e){
              console.log(e);
          }
      } else {
          console.log(`Can't transfer. qtyOwner ${qtyOwner} destWallet ${destWallet.wallets} qtyDest ${qtyDest}`)
      }
    })
    .on('end', () => {
      console.log('Address list successfully processed')
      return;
    });
}

main();