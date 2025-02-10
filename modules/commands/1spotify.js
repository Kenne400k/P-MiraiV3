const axios = require("axios");

module.exports.config = {
    name: "spotify",
    version: "1.1.0",
    hasPermission: 1,
    credits: "Nguyễn Trương Thiện Phát (Pcoder)",
    description: "Lấy nhạc từ Spotify",
    commandCategory: "Tiện ích",
    usages: "/spotify top5 | /spotify top100 | /spotify song {name}",
    cooldowns: 5
};

const token = "4b9c8f9294df471ab152cb4d6ef2f21a"; // Token hợp lệ

async function fetchSpotifyData(endpoint) {
    try {
        const response = await axios.get(`https://api.spotify.com/v1/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ Spotify:", error);
        return null;
    }
}

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    if (!args[0]) {
        return api.sendMessage("❌ Lệnh không hợp lệ! Sử dụng: /spotify top5 | /spotify top100 | /spotify song {name}", threadID, messageID);
    }

    if (args[0] === "top5") {
        const topTracks = await fetchSpotifyData("me/top/tracks?time_range=long_term&limit=5");
        if (!topTracks) return api.sendMessage("❌ Lỗi khi lấy dữ liệu từ Spotify!", threadID, messageID);
        
        const message = topTracks.items.map((track, index) =>
            `${index + 1}. ${track.name} - ${track.artists.map(artist => artist.name).join(", ")}`
        ).join("\n");

        return api.sendMessage(`🎵 Top 5 bài hát của bạn trên Spotify:\n${message}`, threadID, messageID);
    }

    if (args[0] === "top100") {
        const topTracks = await fetchSpotifyData("me/top/tracks?time_range=long_term&limit=100");
        if (!topTracks) return api.sendMessage("❌ Lỗi khi lấy dữ liệu từ Spotify!", threadID, messageID);
        
        const message = topTracks.items.map((track, index) =>
            `${index + 1}. ${track.name} - ${track.artists.map(artist => artist.name).join(", ")}`
        ).join("\n");

        return api.sendMessage(`🎵 Top 100 bài hát của bạn trên Spotify:\n${message}`, threadID, messageID);
    }

    if (args[0] === "song" && args.length > 1) {
        const songName = args.slice(1).join(" ");
        try {
            const response = await fetchSpotifyData(`search?q=${encodeURIComponent(songName)}&type=track&limit=1`);
            
            const track = response.tracks.items[0];
            if (!track) return api.sendMessage("❌ Không tìm thấy bài hát!", threadID, messageID);
            
            const message = `🎵 Bài hát tìm thấy:\nTên: ${track.name}\nNghệ sĩ: ${track.artists.map(artist => artist.name).join(", ")}\nAlbum: ${track.album.name}\nLink: ${track.external_urls.spotify}`;
            
            const previewUrl = track.preview_url;
            if (previewUrl) {
                const audioBuffer = (await axios.get(previewUrl, { responseType: "arraybuffer" })).data;
                const filePath = `/tmp/${track.id}.mp3`;
                require("fs").writeFileSync(filePath, audioBuffer);
                return api.sendMessage({ body: message, attachment: require("fs").createReadStream(filePath) }, threadID, messageID);
            }
            return api.sendMessage(message, threadID, messageID);
        } catch (error) {
            console.error("Lỗi khi tìm kiếm bài hát:", error);
            return api.sendMessage("❌ Lỗi khi tìm kiếm bài hát!", threadID, messageID);
        }
    }

    return api.sendMessage("❌ Lệnh không hợp lệ! Sử dụng: /spotify top5 | /spotify top100 | /spotify song {name}", threadID, messageID);
};
