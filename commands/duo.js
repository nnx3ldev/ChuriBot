const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('duo')
        .setDescription('Calcula la sinergia y compatibilidad de dúo competitivo entre dos usuarios.')
        .addUserOption(option => option.setName('jugador1').setDescription('Primer jugador').setRequired(true))
        .addUserOption(option => option.setName('jugador2').setDescription('Segundo jugador').setRequired(true)),
    async execute(interaction) {
        const p1 = interaction.options.getUser('jugador1');
        const p2 = interaction.options.getUser('jugador2');

        const synergy = Math.abs(parseInt(p1.id) + parseInt(p2.id)) % 101;
        
        let rankStatus = '⚠️ Tienen que practicar más su comunicación.';
        if (synergy > 75) rankStatus = '🔥 ¡Que aura tiene este duo, ni quien los pare.';
        else if (synergy > 40) rankStatus = '⚡ Los que se odian se aman.';

        const embed = new EmbedBuilder()
            .setTitle('🎮 Analizador de Sinergia de Dúo')
            .setDescription(`**${p1.username}** ⚔️ **${p2.username}**\n\nSinergia de equipo: **${synergy}%**\n${rankStatus}`)
            .setColor('DarkNavy');

        await interaction.reply({ embeds: [embed] });
    }
};