require('dotenv').config()
const Utils = require('./utils')

const startBlock = Utils.startBlock
const nodeLimit = Utils.NodeLimit
const nodeIndex = Utils.NodeIndex

let currentBlock = startBlock
const TrackContractDeployment = async () => {
  const func = async () => {
    let remainder = currentBlock % nodeLimit
    if (remainder == nodeIndex) {
      let isSuccessful = await Utils.analyzeBlock(currentBlock)
      if (isSuccessful) currentBlock += nodeLimit
    }
    setTimeout(async () => {
      await func()
    }, 1000 * 2)
  }
  await func()
}

module.exports = TrackContractDeployment
