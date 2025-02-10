module.exports.config = {
    name: "2ten",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Judas ?",
    description: "",
    commandCategory: "nsfw",
    usages: "",
    cooldowns: 5
};
module.exports.run = async function ({ api, event, args, Threads, Users }) {
  try{
    const axios = require('axios')
    var msg = '', image = [],link_ = [], link = [];
    if(args[0] == "sreach" || args[0] == "src"){
     const resp = (await axios.get('http://172.105.120.88:5000/2ten/sreach?keyw=' + encodeURIComponent(args.splice(1).join(" ")))).data;
      if(resp.length > 5) var lengt = 5;
      else lengt = resp.length
     for(let i = 0; i < lengt; i++){

const t = (await axios.get(`http://172.105.120.88:5000/dl/sp?link=${resp[i].img}`, {
        responseType: "stream"
      })).data;
    image.push(t)
    link.push(resp[i].link)
msg += `Name: ${resp[i].text}\nType: ${resp[i].othername}\nLink: ${resp[i].link}\n==========\n`
}
return api.sendMessage({body: msg + "\nReply Theo STT Để Đọc Truyện nhé Ông Già", attachment: image}, event.threadID, (err, info) => {
    return global.client.handleReply.push({
      step: 1,
      name: this.config.name,
      lin : link,
      sotrang: 0,
      author: event.senderID,
      messageID: info.messageID
    });
  }, event.messageID);
    }
    
    const resp = (await axios.get('http://172.105.120.88:5000/2ten/list')).data
for(let i = 0; i < 5; i++){
// const upload = (await axios.get('https://api2.phamquoccuong.xyz/imgur?link=' + resp[i].img)).data
const t = (await axios.get(`http://172.105.120.88:5000/dl/sp?link=${resp[i].img}`, {
        responseType: "stream"
      })).data;
    image.push(t)
    link.push(resp[i].link)
msg += `Name: ${resp[i].text}\nType: ${resp[i].othername}\nLink: ${resp[i].link}\n==========\n`
}
  return api.sendMessage({body: msg + "\nReply Theo STT Để Đọc Truyện nhé Ông Già", attachment: image}, event.threadID, (err, info) => {
    return global.client.handleReply.push({
      step: 1,
      name: this.config.name,
      lin : link,
      sotrang: 0,
      author: event.senderID,
      messageID: info.messageID
    });
  }, event.messageID);
} catch(e){
    console.log(e)
}
}
module.exports.handleReply = async function({ api, event, args, handleReply, client, __GLOBAL, Threads, Users, Currencies }) {
    try{
  const axios = require("axios");
  if(event.senderID !== handleReply.author) return;
  api.unsendMessage(handleReply.messageID);
  if(handleReply.step == 1){
    const link_ = (await axios.get('http://172.105.120.88:5000/2ten/read?link=' + handleReply.lin[event.body - 1])).data
    const tranh = (await axios.get('http://172.105.120.88:5000/2ten/readv2?link=' + link_)).data
    const upload = (await axios.get('https://api2.phamquoccuong.xyz/imgur?link=' + tranh[0])).data
    const t = (await axios.get(`${upload.uploaded.image}`, {
        responseType: "stream"
      })).data;
    return api.sendMessage({body: "Vui lòng điền số hoặc nhấn next để đọc truyện UwU", attachment: t}, event.threadID, (err, info) => {
   global.client.handleReply.push({
      step: 2,
      name: this.config.name,
      tranh: tranh,
      sotrang: 0,
      author: event.senderID,
      messageID: info.messageID
    });
  }, event.messageID);
  } if(handleReply.step == 2){
    if(event.body == "next" || event.body == "Next"){
        var sotrang_ = parseInt(handleReply.sotrang) + 1
    } else {
        var sotrang_ = parseInt(event.body)
    }
const upload = (await axios.get('https://api2.phamquoccuong.xyz/imgur?link=' + handleReply.tranh[sotrang_])).data
    const t = (await axios.get(`${upload.uploaded.image}`, {
        responseType: "stream"
      })).data;
      api.sendMessage({body: "Vui lòng điền số hoặc nhấn next để đọc truyện UwU", attachment: t}, event.threadID, (err, info) => {
        if(err) console.log(err)
   global.client.handleReply.push({
      step: 3,
      name: this.config.name,
      tranh: handleReply.tranh,
      sotrang: handleReply.sotrang + sotrang_,
      author: event.senderID,
      messageID: info.messageID
    });
  }, event.messageID); 
  } if(handleReply.step == 3){
    if(event.body == "next" || event.body == "Next"){
        var sotrang_ = parseInt(handleReply.sotrang) + 1
    } else {
        var sotrang_ = parseInt(event.body)
    }
const upload = (await axios.get('https://api2.phamquoccuong.xyz/imgur?link=' + handleReply.tranh[sotrang_])).data
    const t = (await axios.get(`${upload.uploaded.image}`, {
        responseType: "stream"
      })).data;
      api.sendMessage({body: "Vui lòng điền số hoặc nhấn next để đọc truyện UwU", attachment: t}, event.threadID, (err, info) => {
        if(err) console.log(err)
   global.client.handleReply.push({
      step: 2,
      name: this.config.name,
      tranh: handleReply.tranh,
      sotrang: handleReply.sotrang + sotrang_,
      author: event.senderID,
      messageID: info.messageID
    });
  }, event.messageID); 
  }
  console.log(handleReply.sotrang)
  } catch(e){
    console.log(e)
  }}