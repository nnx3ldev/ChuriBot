const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('duo')
        .setDescription('Calcula la sinergia de dúo competitivo entre dos usuarios.')
        .addUserOption(option => option.setName('jugador1').setDescription('Primer jugador').setRequired(true))
        .addUserOption(option => option.setName('jugador2').setDescription('Segundo jugador').setRequired(true)),
    
    async execute(interactionOrMessage) {
        let p1, p2;

        if (interactionOrMessage.isChatInputCommand && interactionOrMessage.isChatInputCommand()) {
            p1 = interactionOrMessage.options.getUser('jugador1');
            p2 = interactionOrMessage.options.getUser('jugador2');
        } else {
            p1 = interactionOrMessage.mentions.users.at(0) || interactionOrMessage.author;
            p2 = interactionOrMessage.mentions.users.at(1) || interactionOrMessage.author;
        }

        const synergy = Math.abs(parseInt(p1.id) + parseInt(p2.id)) % 101;
        
        let rankStatus = '';
        let embedColor = 'DarkNavy';
        let selectedGif = '';

        // Asignación de rangos con sus respectivos GIFs de Klipy
        if (synergy === 100) {
            rankStatus = "🏆 **Puro aura traen los reales GOATs.**";
            embedColor = 'Gold';
            selectedGif = 'https://klipy.com/gifs/topple-t0pple.gif';
        } else if (synergy >= 85) {
            rankStatus = '🔥 99 de química, no hay quien los detenga.';
            embedColor = 'Green';
            selectedGif = 'https://klipy.com/gifs/marcelo-combo-minecraft-combo.gif';
        } else if (synergy >= 65) {
            rankStatus = '⚡ Duo que impone, son buenos juntos.';
            embedColor = 'Blurple';
            selectedGif = 'https://klipy.com/gifs/minemen-mmc.gif';
        } else if (synergy >= 40) {
            rankStatus = '🤝 Relación neutral. A veces carrean y a veces trollean.';
            embedColor = 'Yellow';
            selectedGif = 'https://klipy.com/gifs/sell-sold.gif';
        } else if (synergy >= 15) {
            rankStatus = '💀 Más malos que pegarle a la mamá.';
            embedColor = 'Orange';
            selectedGif = 'https://klipy.com/gifs/minecraft-sad-2.gif';
        } else {
            rankStatus = '🚨 Cáncer.';
            embedColor = 'Red';
            selectedGif = 'https://klipy.com/gifs/minecraft-bedwars-fail.gif';
        }

        const embed = new EmbedBuilder()
            .setTitle('🎮 Analizador de Sinergia de Dúo')
            .setDescription(`**${p1.username}** ⚔️ **${p2.username}**\n\nSinergia de equipo: **${synergy}%**\n\n${rankStatus}`)
            .setImage(selectedGif)
            .setColor(embedColor);

        await interactionOrMessage.reply({ embeds: [embed] });
    }
};