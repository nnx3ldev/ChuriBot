const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const duoGifs = [
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Z0aXpmeHl3eTZ1OHJ2M3V5OWF0N2R0am05a2d6b3Bvbm9sN2VpNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26u4v35AKx0aCJI0g/giphy.gif',
    'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWN2bHFobG9qajFhYXF1NXh5aXVveWp5aTN3b3MxdmV0bDRsdW5pYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPnAiaMCws8nOsE/giphy.gif',
    'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDkyYjVwZWtnZXl4MTRjYXl5bnd3aWlweTZ2dzg5aHJwZ2c5dTBwZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlP2gz0rCuHM5uE/giphy.gif'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('duo')
        .setDescription('Calcula la sinergia de dúo competitivo entre dos usuarios.')
        .addUserOption(option => option.setName('jugador1').setDescription('Primer jugador').setRequired(true))
        .addUserOption(option => option.setName('jugador2').setDescription('Segundo jugador').setRequired(true)),
    
    // Soporte tanto para Slash (interaction) como para Prefijo (message, client, args)
    async execute(interactionOrMessage, client, args) {
        let p1, p2;

        // Detectar si se ejecutó como Slash Command o por Prefijo
        if (interactionOrMessage.isChatInputCommand && interactionOrMessage.isChatInputCommand()) {
            p1 = interactionOrMessage.options.getUser('jugador1');
            p2 = interactionOrMessage.options.getUser('jugador2');
        } else {
            // Lógica para el comando por prefijo (!duo @usuario1 @usuario2)
            p1 = interactionOrMessage.mentions.users.at(0) || interactionOrMessage.author;
            p2 = interactionOrMessage.mentions.users.at(1) || interactionOrMessage.author;
        }

        const synergy = Math.abs(parseInt(p1.id) + parseInt(p2.id)) % 101;
        const randomGif = duoGifs[Math.floor(Math.random() * duoGifs.length)];
        
        let rankStatus = '';
        let embedColor = 'DarkNavy';

        if (synergy === 100) {
            rankStatus = "🏆 **Puro aura traen los reales GOATs.**"; // Comilla corregida
            embedColor = 'Gold';
        } else if (synergy >= 85) {
            rankStatus = '🔥 99 de química, no hay quien los detenga.';
            embedColor = 'Green';
        } else if (synergy >= 65) {
            rankStatus = '⚡ Duo que impone, son buenos juntos.';
            embedColor = 'Blurple';
        } else if (synergy >= 40) {
            rankStatus = '🤝 Relación neutral. A veces carrean y a veces trollean.';
            embedColor = 'Yellow';
        } else if (synergy >= 15) {
            rankStatus = '💀 Más malos que pegarle a la mamá.';
            embedColor = 'Orange';
        } else {
            rankStatus = '🚨 Cáncer.';
            embedColor = 'Red';
        }

        const embed = new EmbedBuilder()
            .setTitle('🎮 Analizador de Sinergia de Dúo')
            .setDescription(`**${p1.username}** ⚔️ **${p2.username}**\n\nSinergia de equipo: **${synergy}%**\n\n${rankStatus}`)
            .setImage(randomGif)
            .setColor(embedColor);

        // Responder dependiendo de cómo fue invocado
        if (interactionOrMessage.reply && typeof interactionOrMessage.isChatInputCommand === 'function' && interactionOrMessage.isChatInputCommand()) {
            await interactionOrMessage.reply({ embeds: [embed] });
        } else {
            await interactionOrMessage.reply({ embeds: [embed] });
        }
    }
};