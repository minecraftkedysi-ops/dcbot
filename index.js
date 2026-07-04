const { Client } = require('discord.js-selfbot-v13');
const express = require('express');
const app = express();

// Botun 7/24 uyanık kalması için mini web sunucusu
app.get('/', (req, res) => {
    res.send('Hesap seste aktif!');
});
app.listen(process.env.PORT || 3000);

const client = new Client({
    checkUpdate: false,
});

const SERVER_ID = '1435663205593776190';
const CHANNEL_ID = '1521557572388130876';

client.on('ready', async () => {
    console.log(`${client.user.username} olarak giriş yapıldı!`);
    
    try {
        const guild = await client.guilds.fetch(SERVER_ID);
        const channel = await client.channels.fetch(CHANNEL_ID);
        
        if (channel && channel.isVoice()) {
            // Kanala bağlan ve kamerayı/sesi kapat (opsiyonel)
            const connection = await client.voice.joinChannel(channel, {
                selfMute: true, // Sesi kapatır
                selfDeaf: true, // Sağırlaştırır
                selfVideo: false // Kamerayı kapatır
            });
            console.log('Başarıyla ses kanalına bağlanıldı ve 7/24 moduna geçildi.');
        } else {
            console.error('Belirtilen ID bir ses kanalı değil!');
        }
    } catch (error) {
        console.error('Kanala bağlanırken hata oluştu:', error);
    }
});

// Eğer sesten bir şekilde düşerse otomatik geri bağlanma
client.on('voiceStateUpdate', (oldState, newState) => {
    if (oldState.member.id === client.user.id && !newState.channelId) {
        console.log('Sesten düşüldü, tekrar bağlanılıyor...');
        const channel = client.channels.cache.get(CHANNEL_ID);
        if (channel) {
            client.voice.joinChannel(channel, { selfMute: true, selfDeaf: true });
        }
    }
});

// Hesap Tokenı Çevre Değişkeninden (Environment Variable) alınacak
client.login(process.env.TOKEN);
