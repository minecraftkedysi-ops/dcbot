// 1. DISCORD'UN YENİ GÜNCELLEME HATASINI (reading 'all') ENGELLEYEN KESİN YAMA
Object.defineProperty(Object.prototype, 'all', {
    get() { return this._all || []; },
    set(val) { this._all = val; },
    configurable: true
});

const { Client } = require('discord-js-selfbot-v13');
const express = require('express');

const client = new Client({ checkUpdate: false });
const app = express();

// 2. RENDER'IN PORTUNU DİNLEYEN WEB SERVER (Port Hatasını Çözer)
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Bot 7/24 Aktif ve Seste!');
});
app.listen(PORT, () => {
    console.log(`[Web Server] Sunucu ${PORT} portunda başarıyla başlatıldı.`);
});

// 3. BOT HAZIR OLDUĞUNDA SES KANALINA BAĞLANMA
client.on('ready', async () => {
    console.log(`[Discord] 🎉 Başarıyla ${client.user.tag} hesabına giriş yapıldı!`);

    const guildId = process.env.GUILD_ID;
    const channelId = process.env.CHANNEL_ID;

    if (!guildId || !channelId) {
        console.log('[Hata] Environment Variables kısmında GUILD_ID veya CHANNEL_ID eksik!');
        return;
    }

    try {
        const guild = await client.guilds.fetch(guildId);
        const channel = await client.channels.fetch(channelId);

        if (channel.isVoice()) {
            // Sese bağlanma komutu
            await client.voice.joinChannel(channel);
            console.log(`[Başarılı] 🚀 Hesabınız "${guild.name}" sunucusundaki "${channel.name}" ses kanalına zınk diye bağlandı!`);
        } else {
            console.log('[Hata] Girdiğiniz CHANNEL_ID bir ses kanalına ait değil!');
        }
    } catch (error) {
        console.error('[Hata] Kanala bağlanırken bir sorun oluştu:', error.message);
    }
});

// Hatalar yüzünden botun çökmesini tamamen engelleyen koruma sistemi
process.on('unhandledRejection', (reason, promise) => {
    console.log('[Hata Yakalandı - Göz Ardı Ediliyor]:', reason.message || reason);
});
process.on('uncaughtException', (err, origin) => {
    console.log('[Hata Yakalandı - Göz Ardı Ediliyor]:', err.message || err);
});

// 4. DISCORD TOKEN İLE GİRİŞ
client.login(process.env.TOKEN);
