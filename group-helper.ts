// 公众号拉群助手
import { Contact, Message, Friendship } from 'wechaty'
import { bot } from './bootstrap'

bot
  .on('message', async (msg: Message) => {
    if (msg.type() === Message.Type.Text) {
      if (!msg.room()) {
        console.log(`msg : ${msg}`)
        const text = msg.text()
        const topicMap = {
          加群: '「禁推文」前端进阶交流群-ssh 2群',
          返现: '课程返现群',
        }
        let topic = topicMap[text]
        console.log('text: ', text)
        console.log('topic: ', topic)
        const contract = msg.from()!
        if (topic) {
          addContactToRoom(contract, topic)
        }
        if (text === '返现') {
          contract.say('已经拉你进群啦，明天统一返现哈。')
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

/**
 * 对新增好友打招呼，提示加群消息
 */
async function greeting(contact: Contact) {
  try {
    await contact.say(
      `Hi，终于等到你！回复「加群」，即可加入进阶交流群哦。回复「返现」，并且发送订单截图，我拉你进返现群，明天统一返还你购买的1元费用哈！`,
    )
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
async function addContactToRoom(contact: Contact, topic: string) {
  const room = await bot.Room.find({ topic })
  console.log('room: ', room)
  if (room) {
    try {
      await room.add(contact)
    } catch (e) {
      console.error(e)
    }
  }
}
