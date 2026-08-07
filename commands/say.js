const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Hace que el bot envíe un mensaje personalizado.')
        .addStringOption(option => option.setName('mensaje').setDescription('El texto que dirá el bot').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const text = interaction.options.getString('mensaje');

        await interaction.channel.send(text);
        await interaction.reply({ content: '¡Mensaje enviado con éxito!', ephemeral: true });
    }
};