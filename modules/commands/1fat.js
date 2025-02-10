module.exports.config = {
  name: "Fat",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Pcoder",
  description: "Random ảnh Fat",
  commandCategory: "Random-IMG",
  usages: "Fat",
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
    var link = [
"https://scontent.xx.fbcdn.net/v/t1.15752-9/472344515_1765062657673273_3504084878892681365_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=104&ccb=1-7&_nc_sid=9f807c&_nc_ohc=aZoZgwW9Q_sQ7kNvgH60LuM&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.xx&oh=03_Q7cD1gGMxMFtR5dJlgcnHvtVCxJ9ehOEadXEEW-gxcxehZ2EGg&oe=67AF3B27",
"https://scontent.xx.fbcdn.net/v/t1.15752-9/462642884_1238303714097902_1142192893060543900_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=101&ccb=1-7&_nc_sid=9f807c&_nc_ohc=9KWIGYvhguwQ7kNvgFqfXry&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.xx&oh=03_Q7cD1gGLXFcuX5Z2P7vBNvtD5XS7J382vilTW8mkuSjVR3GLSA&oe=67AF5027",
"https://scontent.xx.fbcdn.net/v/t1.15752-9/473356643_587613160780540_9110659194572857242_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=108&ccb=1-7&_nc_sid=9f807c&_nc_ohc=0-Whv4dsreAQ7kNvgFdMUvH&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.xx&oh=03_Q7cD1gFYVFCL6tXNjOFSF9MuC9OdltzS8J0-2trbmePcuIOUuw&oe=67AF30F9",
"https://scontent.xx.fbcdn.net/v/t1.15752-9/473001632_618954333998542_4615923665018606875_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_ohc=NdxykbdDUr8Q7kNvgEoQMyo&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.xx&oh=03_Q7cD1gEyfchkznm3omiWcC_SuCZOdoRhdAaxkmEPBOt_OGfgKg&oe=67AF4B68",
"https://scontent.xx.fbcdn.net/v/t1.15752-9/473094455_979056250943471_2483849253473704263_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=105&ccb=1-7&_nc_sid=9f807c&_nc_ohc=-9cGKbTdztAQ7kNvgFpSePh&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.xx&oh=03_Q7cD1gGAuEqLnThqscsWuAMc-slsdC79OpYTSbZc0p0a4uBG-w&oe=67AF60FD",
"https://scontent.xx.fbcdn.net/v/t1.15752-9/472837820_1283251619393449_9075686471836321681_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=109&ccb=1-7&_nc_sid=9f807c&_nc_ohc=g8IbDL6XXdoQ7kNvgH_5Rnf&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.xx&oh=03_Q7cD1gEnW6M9HPeEG-rnbopm059Gmc05rimpyW0MPvHNqdcSGQ&oe=67AF43F4",
"https://scontent.xx.fbcdn.net/v/t1.15752-9/472839723_1317650329362075_6655433216708046503_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=107&ccb=1-7&_nc_sid=9f807c&_nc_ohc=qq4ghuYQioIQ7kNvgGPr9sl&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.xx&oh=03_Q7cD1gH7nBYwBGAZmrh9kpxuzYrzjAGFdTxAMDJoBo1rDbO17g&oe=67AF579B",
"https://scontent.xx.fbcdn.net/v/t1.15752-9/473357780_575881445411730_4436926480075712091_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=104&ccb=1-7&_nc_sid=9f807c&_nc_ohc=815dAR4hLy0Q7kNvgE-nzGr&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.xx&oh=03_Q7cD1gFBIqHJ2s8pXIW0rQR6F06-T8CWZ9lH8ZLTgnnGoa9N_Q&oe=67AF5AFB",
"https://scontent.xx.fbcdn.net/v/t1.15752-9/472873289_9569274166449227_4102420812165576465_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=9f807c&_nc_ohc=Q00ZtWSPe7QQ7kNvgF1Dz5U&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.xx&oh=03_Q7cD1gEYkTcupSD6z8aPWou4NlG795s2a7P9T7KmT-nHxVkY6w&oe=67AF351F",
    ];
     var callback = () => api.sendMessage({body:`Fat cac`,attachment: fs.createReadStream(__dirname + "/cache/1.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.jpg"));  
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/1.jpg")).on("close",() => callback());
   };