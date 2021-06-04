import React, { useState } from 'react'
import bsv from 'bsv'
import {
  FormControl,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Button,
  Typography,
  Divider
} from '@material-ui/core'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import style from './style'
import { makeStyles } from '@material-ui/core/styles'
import { Casino, Delete } from '@material-ui/icons'
import { createAction } from '@babbage/sdk'

const useStyles = makeStyles(style, {
  name: 'Scratchpad'
})

export default () => {
  const classes = useStyles()
  const [privateKey, setPrivateKey] = useState('')
  const [address, setAddress] = useState('')
  const [txData, setTxData] = useState([])
  const [resultTXID, setResultTXID] = useState('')

  const broadcast = async e => {
    e.preventDefault()
    try {
      const parsedData = parseTransactionData()
      const action = await createAction({
        description: 'Send a transaction with Scratchpad Studio',
        senderWIF: privateKey,
        data: parsedData
      })
      setResultTXID(action.txid)
      toast.dark('Broadcasted! TXID: ' + action.txid)
    } catch (e) {
      toast.error(e.message)
    }
  }

  const parseTransactionData = () => {
    return txData.map(el => {
      if (el.type === 'utf8') {
        return el.data
      } else { // hex
        return Uint8Array.from(Buffer.from(el.data, 'hex'))
      }
    })
  }

  const handlePrivateKeyChange = e => {
    setPrivateKey(e.target.value)
    try {
      const importedKey = bsv.PrivateKey.fromWIF(e.target.value)
      setAddress(importedKey.toAddress().toString())
    } catch (e) {
      setAddress('')
    }
  }

  const generatePrivateKey = () => {
    const privateKey = bsv.PrivateKey.fromRandom()
    setPrivateKey(privateKey.toWIF())
    setAddress(privateKey.toAddress().toString())
  }

  const addTxData = () => {
    setTxData([
      ...txData,
      { type: 'utf8', data: '' }
    ])
  }

  const removeTxData = i => {
    const copy = [...txData]
    copy.splice(i, 1)
    setTxData(copy)
  }

  const setTxDataType = (i, t) => {
    const copy = [...txData]
    copy[i].type = t
    setTxData(copy)
  }

  const handleTxDataChange = (i, t) => {
    const copy = [...txData]
    copy[i].data = t
    setTxData(copy)
  }

  return (
    <form onSubmit={broadcast} className={classes.content_wrap}>
      <ToastContainer />
      <center>
        <Typography variant='h4'>Scratchpad</Typography>
        <Typography color='textSecondary'>Transaction broadcaster</Typography>
      </center>
      <Typography variant='h5'>Private Key</Typography>
      <Typography paragraph>
        Enter the private key for the address from which the transaction is to be broadcast.
      </Typography>
      <div className={classes.privkey_grid}>
        <div>
          <TextField
            fullWidth
            variant='outlined'
            label='Private Key (WIF)'
            value={privateKey}
            onChange={handlePrivateKeyChange}
          />
          <Typography color='textSecondary'>Address: {address}</Typography>
        </div>
        <IconButton onClick={generatePrivateKey}>
          <Casino color='primary' />
        </IconButton>
      </div>
      <Typography variant='h5'>Data Fields</Typography>
      <Typography paragraph>
        Compose your data transaction by adding OP_RETURN fields.
      </Typography>
      <div className={classes.fields}>
        {txData.map((d, i) => (
          <>
            <div className={classes.field}>
              <FormControl>
                <Select
                  value={d.type}
                  onChange={e => setTxDataType(i, e.target.value)}
                >
                  <MenuItem value='hex'>Hex</MenuItem>
                  <MenuItem value='utf8'>UTF8</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                variant='outlined'
                multiline
                label='Data'
                value={d.data}
                onChange={e => handleTxDataChange(i, e.target.value)}
              />
              <IconButton
                onClick={() => removeTxData(i)}
              >
                <Delete color='secondary' />
              </IconButton>
            </div>
            <Divider />
          </>
        ))}
      </div>
      <Button
        variant='contained'
        fullWidth onClick={addTxData}
      >
        Add...
      </Button>
      <center className={classes.broadcast_wrap}>
        <Button
          variant='contained'
          color='primary'
          size='large'
          type='submit'
        >
          Broadcast
        </Button>
        <br />
        <br />
        {resultTXID && (
          <Typography>Success! TXID: {resultTXID}</Typography>
        )}
      </center>
    </form>
  )
}
