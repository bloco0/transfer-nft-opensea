# transfer-nft-opensea
Script to distribute POAP ERC-1155 NFTs on Opensea for a list of wallets, executing directly the smart-contract.

## Pre-requisites
- nodejs 12

## Setup
$ yarn install
1) Rename .env-sample to .env
2) Rename wallets.csv-sample do wallets.csv
3) Create a new mnemonic and wallet and update .env
4) Update INFURA_KEY with yous own Infura account credentials
5) Update Network with Infura network
6) API_KEY is optional opensea api key
7) Create a mnemonic and wallet (OWNER_ADDRESS), and update .env. Hint: create a new account on metamask and use those credentials.

## How to use
1) Publish your opensea nft
2) Update .env with smart-contract address and token id
3) Fill wallets.csv with wallets
4) Run:
$ node transfer-nft-web3.js

Remember to have coins on your wallet to pay for gas.
The OWNER_ADDRESS (wallet) must be the owner of the nft(s).
