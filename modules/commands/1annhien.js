module.exports.config = {
    name: "anhien",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "FAT",
    description: "",
    commandCategory: "Random-IMG",
    usages: "anhien",
    cooldowns: 2,
    dependencies: {
      "request":"",
      "fs-extra":"",
      "axios":""
    }
      
  };
  
  module.exports.run = async({api,event,args,Users,Threads,Currencies}) => {
  const axios = global.nodemodule["axios"];
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];
      api.sendMessage({
                    body: "𝗔𝗱𝘂𝘂 𝘅𝗶𝗻𝗵 𝘁𝗵𝗶𝗲̣̂𝗰𝗰 𝗰𝗮́𝗰 𝗲𝗺 💖", 
                    attachment: fs.createReadStream(__dirname + `/Noprefix/anhien.jpg`)
                }, event.threadID, event.messageID);
     };