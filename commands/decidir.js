const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('decidir')
        .setDescription('Ayuda a tomar una decisión rápida entre dos opciones.')
        .addStringOption(option => option.setName('opcion1').setDescription('Primera opción').setRequired(true))
        .addStringOption(option => option.setName('opcion2').setDescription('Segunda opción').setRequired(true)),
    async execute(interaction) {
        const opt1 = interaction.options.getString('opcion1');
        const opt2 = interaction.options.getString('opcion2');

        const chosen = Math.random() < 0.5 ? opt1 : opt2;

        const embed = new EmbedBuilder()
            .setTitle('🎲 El Destino Ha Hablado')
            .addFields(
                { name: 'Opciones evaluadas', value: `1. ${opt1}\n2. ${opt2}` },
                { name: '✨ Resultado elegido', value: `**${chosen}**` }
            )
            .setColor('Purple');

        await interaction.reply({ embeds: [embed] });
    }
};