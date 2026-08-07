const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Crea y envía un embed totalmente personalizado.')
        .addStringOption(option => option.setName('titulo').setDescription('Título del embed').setRequired(true))
        .addStringOption(option => option.setName('descripcion').setDescription('Texto principal del anuncio').setRequired(true))
        .addStringOption(option => option.setName('color').setDescription('Color en formato HEX (Ej: #FF0000)').setRequired(false))
        .addStringOption(option => option.setName('imagen_url').setDescription('URL de una imagen opcional').setRequired(false))
        .addAttachmentOption(option => option.setName('imagen_archivo').setDescription('O sube una imagen como archivo adjunto').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interactionOrMessage, client, args) {
        // Adaptador para Slash y Prefijo por si acaso
        const isSlash = interactionOrMessage.isChatInputCommand && interactionOrMessage.isChatInputCommand();
        
        let titulo, descripcion, colorHex, imageUrl, attachment;

        if (isSlash) {
            titulo = interactionOrMessage.options.getString('titulo');
            descripcion = interactionOrMessage.options.getString('descripcion');
            colorHex = interactionOrMessage.options.getString('color') || '#5865F2';
            imageUrl = interactionOrMessage.options.getString('imagen_url');
            attachment = interactionOrMessage.options.getAttachment('imagen_archivo');
        } else {
            // Manejo rápido si se usa por mensaje tradicional (opcional)
            return interactionOrMessage.reply('Por favor utiliza el comando de barra `/embed` para una mejor experiencia configurando imágenes y archivos.');
        }

        const embed = new EmbedBuilder()
            .setTitle(titulo)
            .setDescription(descripcion)
            .setColor(colorHex);

        // Prioriza la imagen subida por archivo adjunto, si no, usa la URL
        if (attachment) {
            embed.setImage(attachment.url);
        } else if (imageUrl) {
            embed.setImage(imageUrl);
        }

        await interactionOrMessage.channel.send({ embeds: [embed] });
        await interactionOrMessage.reply({ content: '¡Embed enviado con éxito!', ephemeral: true });
    }
};