const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('aura')
        .setDescription('Mide tu nivel de aura actual en el servidor.'),
    async execute(interaction) {
        const aura = Math.floor(Math.random() * 200000) - 50000; // Puede ser positivo o negativo
        const embed = new EmbedBuilder()
            .setTitle('✨ Medidor de Aura')
            .setDescription(`El aura actual de **${interaction.user.username}** es de: \`${aura.toLocaleString()} pts\``)
            .setColor(aura > 0 ? 'Green' : 'Red');

        await interaction.reply({ embeds: [embed] });
    }
};