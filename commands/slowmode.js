const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Establece el modo lento en el canal actual.')
        .addIntegerOption(option => option.setName('segundos').setDescription('Segundos de espera (0 para desactivar)').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        const seconds = interaction.options.getInteger('segundos');
        
        await interaction.channel.setRateLimitPerUser(seconds);
        
        if (seconds === 0) {
            await interaction.reply({ content: '⏱️ El modo lento ha sido **desactivado**.', ephemeral: true });
        } else {
            await interaction.reply({ content: `⏱️ Modo lento configurado a **${seconds} segundos** por mensaje.`, ephemeral: true });
        }
    }
};