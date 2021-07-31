require('dotenv').config()
const Utils = require('./utils')

const startBlock = Utils.startBlock
const nodeLimit = Utils.NodeLimit
const nodeIndex = Utils.NodeIndex

let currentBlock = startBlock
const TrackContractDeployment = async () => {
  const func = async () => {
    console.log(currentBlock)
    let remainder = currentBlock % nodeLimit
    if (remainder == nodeIndex) await Utils.analyzeBlock(currentBlock)
    currentBlock += nodeLimit
    setTimeout(async () => {
      await func()
    }, 1000 * 2)
  }
  await func()
}

module.exports = TrackContractDeployment
