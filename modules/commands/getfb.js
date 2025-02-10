module.exports.config = {
  name: "getfb",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "TrúcCute",//chính chủ xin đừng hiểu nhầm thay credits 
  description: "Lấy link fb",
  commandCategory: "tiện ích",
  usages: "[trống] or [tag]/[reply]/[uid]",
  cooldowns: 5
}
module.exports.run = async function ({ api, event, args }) {
  const { messageReply, senderID, threadID, messageID, type, mentions} = event;
  if (!args[0]) {
    if (type == "message_reply") {
      uid = messageReply.senderID
    } else {
      uid = senderID
    }
  } else if (args.join().indexOf('@') !== -1) {
      uid = Object.keys(mentions)[0]
  } else {
    uid = args[0]
  }
  let data = await api.getUserInfo(uid),
       { profileUrl } = data[uid];
  return api.sendMessage(`${profileUrl}`, threadID, messageID)
}
