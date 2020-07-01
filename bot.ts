// bot.ts
import { Contact, Message, Wechaty, Friendship } from 'wechaty'
import { ScanStatus } from 'wechaty-puppet'
import { PuppetPadplus } from 'wechaty-puppet-padplus'
import QrcodeTerminal from 'qrcode-terminal'

const token = 'puppet_padplus_390426d28a9b53aa'

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
  .on('message', async (msg: Message) => {
    if (msg.type() === Message.Type.Text) {
      if (!msg.room()) {
        console.log(`msg : ${msg}`)
        const text = msg.text()
        if (text === '加群') {
          addContactToRoom(msg.from()!)
        }
      }
    }
  })
  .on('friendship', async (friendship) => {
    // 如果是添加好友请求
    if (friendship.type() === Friendship.Type.Receive) {
      // 通过好友请求
      await friendship.accept()
      const contact = friendship.contact()
      greeting(contact)
      addAlias(contact)
    }
  })
  .start()

/**
 * 对新增好友打招呼，提示加群消息
 */
async function greeting(contact: Contact) {
  try {
    await contact.say(`Hi，终于等到你！回复「加群」，即可加入进阶交流群哦。`)
    console.log(`greeting to ${contact.name()} successfully!`)
  } catch (e) {
    console.log(`failed to greeting to ${contact.name()}`)
  }
}

/**
 * 为好友添加别名 「前端 + 名字」
 */
async function addAlias(contact: Contact) {
  const name = contact.name()
  const newAlias = `前端 ${name}`
  try {
    await contact.alias(newAlias)
    console.log(`change ${contact.name()}'s alias ${newAlias} successfully!`)
  } catch (e) {
    console.log(`failed to change ${contact.name()} alias!`)
  }
}
/**
 * 添加联系人入群
 */
async function addContactToRoom(contact: Contact) {
  const room = await bot.Room.find({ topic: '「禁推文」前端进阶交流群-ssh 2群' })
  if (room) {
    try {
      await room.add(contact)
    } catch (e) {
      console.error(e)
    }
  }
}
