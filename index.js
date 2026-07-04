const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');

// Discord'un API değişikliklerinden kaynaklanan hataları engellemek için önlemler
process.on('unhandledRejection', (reason, p) => {
    console.log(' [Hata Yakalandı] Göz ardı ediliyor:', reason);
});
process.on("uncaughtException", (err, origin) => {
    console.log(' [Hata Yakalandı] Göz ardı ediliyor:', err);
});

const client = new Client({
    checkUpdate: false,
    // Kütüphanenin çökmesine sebep olan gereksiz kullanıcı verilerini çekmesini engelliyoruz
    ws: { 
        properties: { $os: 'Linux', $browser: 'Discord Client', $device: 'discord.js' } 
    }
});

// Çökmeyi engelleyen kritik yama (Client hazır olmadan hemen önce araya giriyoruz)
client.on('shardReady', () => {
    if (client.user && client.user.settings) {
        client.user.settings._patch = function(data) {
            return this;
        };
    }
});

client.on('ready', async () => {
    console.log(`🎉 Bot başarıyla ${client.user.tag} hesabına giriş yaptı!`);

    // Render'da Environment kısmına girdiğin kanal ve sunucu ID'lerini çeker
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
            selfMute: true,  // Botun sesi kapalı olsun
            selfDeaf: true   // Botun sağırlaştırması açık olsun (sunucuyu yormaz)
        });
        console.log("🚀 Başarıyla ses kanalına bağlanıldı ve 7/24 aktiflik başlatıldı!");
    } catch (error) {
        console.error("❌ Ses kanalına bağlanırken bir hata oluştu:", error);
    }
});

// Render'a girdiğin TOKEN değişkeni ile hesaba giriş yapar
client.login(process.env.TOKEN);
