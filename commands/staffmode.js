const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('staffmode')
        .setDescription('Bloquea o desbloquea el canal exclusivamente para el staff.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        const channel = interaction.channel;
        const everyoneRole = interaction.guild.roles.everyone;

        const currentPermission = channel.permissionsFor(everyoneRole).has(PermissionFlagsBits.SendMessages);
        
        await channel.permissionOverwrites.edit(everyoneRole, {
            SendMessages: !currentPermission,
            AddReactions: !currentPermission,
            CreatePublicThreads: !currentPermission
        });

        await interaction.reply({ content: `🔒 Modo staff ${!currentPermission ? 'activado' : 'desactivado'} para este canal.`, ephemeral: true });
    }
};