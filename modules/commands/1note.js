module.exports.config = {
    name: "note",
    version: "1.0.0",
    hasPermssion: 3,
    credits: "D-Jukie",
    description: "Áp dụng code từ buildtooldev và pastebin",
    commandCategory: "Admin",
    usages: "[reply or text]",
    cooldowns: 0,
    dependencies: {
        "axios": "",
        "cheerio": "",
        "request": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    const axios = require('axios');
    const fs = require('fs');
    const request = require('request');
    const cheerio = require('cheerio');
    const { join, resolve } = require("path");
    const { senderID, threadID, messageID, messageReply, type } = event;

    // Kiểm tra quyền Admin
    if (event.senderID != 100047128875560) {
        return api.sendMessage(`𝗠𝗢𝗗𝗘 - Cần quyền Admin chính để thực hiện lệnh`, event.threadID, event.messageID);
    }

    let name = args[0];
    let text = '';

    if (type == "message_reply") {
        text = messageReply.body;
    }

    if (!text && !name) {
        return api.sendMessage('➢ Vui lòng reply link muốn áp dụng code hoặc ghi tên file để up code lên pastebin!', threadID, messageID);
    }

    if (!text && name) {
        var data = fs.readFile(
            `${__dirname}/${args[0]}.js`,
            "utf-8",
            async (err, data) => {
                if (err) {
                    return api.sendMessage(`➢ Lệnh ${args[0]} không tồn tại!.`, threadID, messageID);
                }

                // Gửi API mock để tạo note với mã
                try {
                    const response = await axios.post(
                        'https://run.mocky.io/v3/4744f612-1973-4457-a32f-008a3ed8539a',  // Mock API URL
                        {
                            text: data
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Charset': 'UTF-8'
                            }
                        }
                    );

                    // Trả về link API mock
                    var link = response.data.mock_url; // API trả về URL của mock
                    return api.sendMessage(link, threadID, messageID);
                } catch (err) {
                    return api.sendMessage(`⇏ Đã xảy ra lỗi khi gửi mã lên Mock API.`, threadID, messageID);
                }
            }
        );
        return;
    }

    // Kiểm tra link và tải dữ liệu từ các nguồn
    var urlR = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    var url = text.match(urlR);

    if (url[0].indexOf('notepad') !== -1) {
        axios.get(url[0]).then(i => {
            var data = i.data;
            fs.writeFile(
                `${__dirname}/${args[0]}.js`,
                data,
                "utf-8",
                function (err) {
                    if (err) return api.sendMessage(`⇏ Đã xảy ra lỗi khi áp dụng code vào ${args[0]}.js`, threadID, messageID);
                    api.sendMessage(`➢ Đã áp dụng code vào ${args[0]}.js, sử dụng command load để sử dụng!`, threadID, messageID);
                }
            );
        });
    }

    if (url[0].indexOf('buildtool') !== -1 || url[0].indexOf('tinyurl.com') !== -1) {
        const options = {
            method: 'GET',
            url: messageReply.body
        };

        request(options, function (error, response, body) {
            if (error) return api.sendMessage('➢ Vui lòng chỉ reply link (không chứa gì khác ngoài link)', threadID, messageID);
            
            const load = cheerio.load(body);
            load('.language-js').each((index, el) => {
                if (index !== 0) return;
                var code = el.children[0].data;
                fs.writeFile(`${__dirname}/${args[0]}.js`, code, "utf-8",
                    function (err) {
                        if (err) return api.sendMessage(`⇏ Đã xảy ra lỗi khi áp dụng code mới cho "${args[0]}.js".`, threadID, messageID);
                        return api.sendMessage(`➢ Đã thêm code này vào "${args[0]}.js", sử dụng command load để sử dụng!`, threadID, messageID);
                    }
                );
            });
        });
        return;
    }

    if (url[0].indexOf('drive.google') !== -1) {
        var id = url[0].match(/[-\w]{25,}/);
        const path = resolve(__dirname, `${args[0]}.js`);
        try {
            await utils.downloadFile(`https://drive.google.com/u/0/uc?id=${id}&export=download`, path);
            return api.sendMessage(`➢ Đã thêm code này vào "${args[0]}.js" nếu xảy ra lỗi thì đổi file drive thành txt nhé!`, threadID, messageID);
        } catch (e) {
            return api.sendMessage(`⇏ Đã xảy ra lỗi khi áp dụng code mới cho "${args[0]}.js".`, threadID, messageID);
        }
    }
};
