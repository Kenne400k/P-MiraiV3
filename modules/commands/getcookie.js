'user strict'
const configCommand = {
    name: 'getcookie',
    version: '10.02',
    hasPermssion: 02,
    credits: 'DC-Nam',
    description: 'Lấy cookie facebook bằng access token',
    commandCategory: 'Tiện ích',
    usages: '[]',
    cooldowns: 3
}, {
    get
} = require('axios');
async function runCommand(arg) {
    const out = (a, b, c, d) => arg.api.sendMessage(a, b?b: arg.event.threadID, c?c: null, d?d: arg.event.messageID);
    try {
        const {
            status,
            message,
            cookie
        } = (await get(`https://api.maihuybao.live/api/getCookie?access_token=${arg.args[0]}`)).data;
        out(status == 'error'?message: cookie)
    } catch(err) {
        out(`${err}`)
    }
};

module.exports = {
    config: configCommand,
    run: runCommand
};