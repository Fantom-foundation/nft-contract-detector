require('dotenv').config()
const Utils = require('./utils')

const nodeIndex = Utils.NodeIndex
const startBlock = Utils.startBlock + nodeIndex
const nodeLimit = Utils.NodeLimit

let currentBlock = startBlock
const TrackContractDeployment = async () => {
  const func = async () => {
    let isSuccessful = await Utils.analyzeBlock(currentBlock)
    if (isSuccessful) currentBlock += nodeLimit
    setTimeout(async () => {
      await func()
    }, 1000 * 2)
  }
  await func()
}

module.exports = TrackContractDeployment
