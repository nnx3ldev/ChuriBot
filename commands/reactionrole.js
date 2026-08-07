const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactionrole')
        .setDescription('Crea un panel de roles por reacción con restricciones.')
        .addStringOption(option => option.setName('titulo').setDescription('Título del embed').setRequired(true))
        .addRoleOption(option => option.setName('rol').setDescription('Rol a entregar').setRequired(true))
        .addStringOption(option => option.setName('emoji').setDescription('Emoji para reaccionar').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const titulo = interaction.options.getString('titulo');
        const rol = interaction.options.getRole('rol');
        const emoji = interaction.options.getString('emoji');

        const embed = new EmbedBuilder()
            .setTitle(titulo)
            .setDescription(`Reacciona con ${emoji} para obtener el rol **${rol.name}**.`)
            .setColor('Blurple');

        const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
        await msg.react(emoji);
        // Nota: Aquí implementarías el listener de 'messageReactionAdd' para validar si el usuario tiene requisitos previos.
    }
};