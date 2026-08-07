const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('Lanza una moneda al aire (Cara o Sello).'),
    async execute(interaction) {
        const result = Math.random() < 0.5 ? 'Cara' : 'Sello';

        const embed = new EmbedBuilder()
            .setTitle('🪙 Lanzamiento de Moneda')
            .setDescription(`La moneda cayó en: **${result}**`)
            .setColor('Gold');

        await interaction.reply({ embeds: [embed] });
    }
};