const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Crea un embed personalizado.')
        .addStringOption(option => option.setName('titulo').setDescription('Título del embed').setRequired(true))
        .addStringOption(option => option.setName('descripcion').setDescription('Texto principal').setRequired(true))
        .addStringOption(option => option.setName('color').setDescription('Color en Hex (Ej: #FF0000)').setRequired(false))
        .addAttachmentOption(option => option.setName('imagen').setDescription('Sube una imagen mediante archivo').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        const titulo = interaction.options.getString('titulo');
        const descripcion = interaction.options.getString('descripcion');
        const color = interaction.options.getString('color') || '#5865F2';
        const imagen = interaction.options.getAttachment('imagen');

        const embed = new EmbedBuilder()
            .setTitle(titulo)
            .setDescription(descripcion)
            .setColor(color);

        if (imagen) embed.setImage(imagen.url);

        await interaction.channel.send({ embeds: [embed] });
        await interaction.reply({ content: '¡Embed creado con éxito!', ephemeral: true });
    }
};