const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Borra una cantidad específica de mensajes (1-100).')
        .addIntegerOption(option => option.setName('cantidad').setDescription('Número de mensajes a borrar').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const amount = interaction.options.getInteger('cantidad');
        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: 'Debes introducir un número entre 1 y 100.', ephemeral: true });
        }

        await interaction.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            return interaction.reply({ content: 'Hubo un error al intentar borrar los mensajes.', ephemeral: true });
        });

        await interaction.reply({ content: `🧹 Se han borrado **${amount}** mensajes correctamente.`, ephemeral: true });
    }
};