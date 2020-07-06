import { bot } from './bootstrap'

const topicName = 'fe'
async function start() {
  const { Gender } = bot.Contact
  const { Male, Female, Unknown } = Gender
  let genderMap = {
    [Male]: 0,
    [Female]: 0,
    [Unknown]: 0,
  }
  const room =  await bot.Room.find({ topic: topicName })
  console.log('room: ', room);
  const members = await room.memberAll()
  members.forEach((contract) => {
    genderMap[contract.gender()]++
  })

  let output = `群「${topicName}」人数统计完毕：`
  let descMap = {
    [Male]: '小哥哥',
    [Female]: '小姐姐',
    [Unknown]: '神秘性别',
  }
  Object.keys(genderMap).forEach((key) => {
    let desc = descMap[key]
    let count = genderMap[key]
    output += `${desc}: ${count}人；`
  })
  console.log(output)
}

bot.on('login', start)
