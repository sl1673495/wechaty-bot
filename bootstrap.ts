// bot.ts
import { Contact, Message, Wechaty, Friendship } from 'wechaty'
import { ScanStatus } from 'wechaty-puppet'
import { PuppetPadplus } from 'wechaty-puppet-padplus'
import QrcodeTerminal from 'qrcode-terminal'
import { token } from './token'

const puppet = new PuppetPadplus({
  token,
})

const name = 'ssh bot'

const bot = new Wechaty({
  puppet,
  name, // generate xxxx.memory-card.json and save login data for the next login
})

bot
  .on('scan', (qrcode, status) => {
    if (status === ScanStatus.Waiting) {
      QrcodeTerminal.generate(qrcode, {
        small: true,
      })
    }
  })
  .on('login', (user: Contact) => {
    console.log(`login success, user: ${user}`)
  })
  .start()

export { bot }
