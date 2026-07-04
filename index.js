const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const http = require('http'); // Render'ı kandırmak için gereken modül

// 1. RENDER PORT HATASINI ÇÖZEN SAHTE WEB SUNUCUSU
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot 7/24 Aktif!\n');
});
// Render'ın bota vereceği portu dinliyoruz (Render artık çökmeyecek)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Sahte web sunucusu ${PORT} portunda başlatıldı.`);
});

// Discord API hatalarını yutan yama
process.on('unhandledRejection', (reason, p) => {
    console.log(' [Hata Yakalandı] Göz ardı ediliyor:', reason);
});
process.on("uncaughtException", (err, origin) => {
    console.log(' [Hata Yakalandı] Göz ardı ediliyor:', err);
});

const client = new Client({
    checkUpdate: false,
    ws: { 
        properties: { $os: 'Linux', $browser: 'Discord Client', $device: 'discord.js' } 
    }
});

client.on('shardReady', () => {
    if (client.user && client.user.settings) {
        client.user.settings._patch = function(data) {
            return this;
        };
    }
});

client.on('ready', async () => {
    console.log(`🎉 Bot başarıyla ${client.user.tag} hesabına giriş yaptı!`);

    const CHANNEL_ID = process.env.CHANNEL_ID;
    const GUILD_ID = process.env.GUILD_ID;

    if (!CHANNEL_ID || !GUILD_ID) {
        console.error("❌ HATA: Render paneline CHANNEL_ID veya GUILD_ID girilmemiş!");
        return;
    }

    try {
        joinVoiceChannel({
            channelId: CHANNEL_ID,
            guildId: GUILD_ID,
            adapterCreator: client.guilds.cache.get(GUILD_ID).voiceAdapterCreator,
            selfMute: true,
            selfDeaf: true
        });
        console.log("🚀 Başarıyla ses kanalına bağlanıldı ve 7/24 aktiflik başlatıldı!");
    } catch (error) {
        console.error("❌ Ses kanalına bağlanırken bir hata oluştu:", error);
    }
});

client.login(process.env.TOKEN);
