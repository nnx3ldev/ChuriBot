const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Lanza un dado de 6 caras (o personaliza el límite).')
        .addIntegerOption(option => option.setName('caras').setDescription('Número de caras del dado (Por defecto 6)').setRequired(false)),
    async execute(interaction) {
        const sides = interaction.options.getInteger('caras') || 6;
        const rollResult = Math.floor(Math.random() * sides) + 1;

        const embed = new EmbedBuilder()
            .setTitle('🎲 Lanzamiento de Dado')
            .setDescription(`Has lanzado un dado de ${sides} caras y salió: **${rollResult}**`)
            .setColor('DarkButNotBlack');

        await interaction.reply({ embeds: [embed] });
    }
};