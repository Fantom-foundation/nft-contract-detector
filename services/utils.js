require('dotenv').config()
const ethers = require('ethers')
const mongoose = require('mongoose')
const NFTCONTRACT = mongoose.model('NFTCONTRACT')

const InterfaceID = require('../constants/abi_interface_id')
const NodeLimit = 10
const NodeIndex = parseInt(process.env.NODEINDEX)
const startBlock = 3672780
const INTERFACEID_1155 = 0xd9b67a26
const INTERFACEID_721 = 0x80ac58cd
const provider = new ethers.providers.JsonRpcProvider(
  process.env.NETWORK_RPC,
  parseInt(process.env.NETWORK_CHAINID),
)

const analyzeBlock = async (blockNumber) => {
  try {
    let blockInfo = await provider.getBlockWithTransactions(blockNumber)
    let txs = blockInfo.transactions
    if (txs.length > 0) {
      let deployedAddresses = []
      txs.map((tx) => {
        if (tx.creates) deployedAddresses.push(tx.creates)
      })
      if (deployedAddresses.length > 0) {
        let contracts = await analyzeContracts(deployedAddresses)
        if (contracts.length > 0) {
          let data = []
          contracts.map((contract) => {
            data.push({
              address: contract[0],
              type: contract[1],
              blockNumber: blockNumber,
            })
          })
          try {
            await NFTCONTRACT.insertMany(data)
          } catch (error) {}
        }
      } else return null
    }
    return true
  } catch (error) {
    return false
  }
}

const analyzeContracts = async (addresses) => {
  const contracts = []
  let promise = addresses.map(async (addr) => {
    let type = await guessContractType(addr)
    if (type == 721) contracts.push([addr, 721])
    if (type == 1155) contracts.push([addr, 1155])
  })
  await Promise.all(promise)
  return contracts
}
const loadContract = (address) => {
  return new ethers.Contract(address, InterfaceID, provider)
}

const guessContractType = async (address) => {
  let contract = loadContract(address)
  try {
    let is721 = await contract.supportsInterface(INTERFACEID_721)
    if (is721) return 721
    let is1155 = await contract.supportsInterface(INTERFACEID_1155)
    if (is1155) return 1155
    return 20
  } catch (error) {
    return 20
  }
}
const toLowerCase = (val) => {
  if (val) return val.toLowerCase()
  else return val
}
const parseToFTM = (inWei) => {
  return parseFloat(inWei.toString()) / 10 ** 18
}
const convertTime = (value) => {
  return parseFloat(value) * 1000
}
const Utils = {
  guessContractType,
  toLowerCase,
  parseToFTM,
  convertTime,
  provider,
  analyzeBlock,
  startBlock,
  NodeLimit,
  NodeIndex,
}

module.exports = Utils
