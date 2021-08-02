require('dotenv').config()
const mongoose = require('mongoose')
require('./models/nftcontract')
const Utils = require('./services/utils')
const TrackContractDeployment = require('./services/contractDeploymentTracker')

const NODEINDEX = parseInt(process.env.NODEINDEX)

const connect = () => {
  const uri = process.env.DB_URL
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'))
  db.once('open', function () {
    console.log('nft contract tracker has been started')
    if (NODEINDEX != 10) {
      console.log('tracking contract deployment')
      TrackContractDeployment()
    } else {
      console.log('tracking names and symbols')
      Utils.trackNameAndSymbol()
    }
  })
}

connect()
