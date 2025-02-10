const ImgurUploader = require("imgur-uploader");
const fs = require("fs");
const { downloadFile } = require("../../utils/index");

module.exports.config = {
  name: "imgur2",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "mod",
  description: "Imgur",
  commandCategory: "tiện ích",
  usages: "[reply]",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID, type, messageReply, messageID } = event;
  const ClientID = "cc";
  if (type !== "message_reply" || messageReply.attachments.length == 0)
    return api.sendMessage(
      "Bạn phải reply một video, ảnh nào đó",
      threadID,
      messageID
    );

  const attachmentSend = [];

  async function getAttachments(attachments) {
    let startFile = 0;
    for (const data of attachments) {
      const ext =
        data.type == "photo" ? "jpg" :
        data.type == "video" ? "mp4" :
        data.type == "audio" ? "m4a" :
        data.type == "animated_image" ? "gif" : "txt";
      const pathSave = __dirname + `/cache/${startFile}.${ext}`;
      ++startFile;
      const url = data.url;
      await downloadFile(url, pathSave);
      attachmentSend.push(pathSave);
    }
  }

  await getAttachments(messageReply.attachments);

  let msg = "";
  let Success = 0;
  let Errors = [];

  for (const getImage of attachmentSend) {
    try {
      const uploadResult = await ImgurUploader.upload(getImage, {
        api_key: ClientID
      });
      console.log(uploadResult);
      msg += `"${uploadResult.link}",\n`;
      fs.unlinkSync(getImage);
      Success++;
    } catch (error) {
      console.error("Error uploading file to Imgur:", error);
      Errors.push(getImage);
      fs.unlinkSync(getImage);
    }
  }

  console.log("Number of successful uploads:", Success);
  console.log("Errors:", Errors);

  return api.sendMessage(`${msg}`, threadID);
};
