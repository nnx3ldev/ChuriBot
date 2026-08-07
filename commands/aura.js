const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Lista de GIFs animados relacionados (puedes cambiarlos por los que prefieras)
const auraGifs = [
    'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaG92aHNucWN2ZHRpMXo3Z3o0Z3V6dW5zMGZ3ZXU5c3R4NWc0NmludyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/LHyvO8a1P8h1JpL1uM/giphy.gif',
    'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHp1dzNqN3V6Y2R4OGFveHRrOXl2a25wYm5sM3E3OHh4NXFucm5lZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9Jvj4u9R7bH72/giphy.gif',
    'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnBqc3V4aW5uOHJwdml5aGVrcTN5b2ZydnE4OHJrdHpxY2NueTByZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tXL4FHDSnIJ0A/giphy.gif'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('aura')
        .setDescription('Mide tu nivel de aura actual en el servidor con animación.'),
    async execute(interaction) {
        const aura = Math.floor(Math.random() * 200000) - 50000;
        const randomGif = auraGifs[Math.floor(Math.random() * auraGifs.length)];

        const embed = new EmbedBuilder()
            .setTitle('✨ Medidor de Aura')
            .setDescription(`El aura actual de **${interaction.user.username}** es de: \`${aura.toLocaleString()} pts\``)
            .setImage(randomGif)
            .setColor(aura > 0 ? 'Green' : 'Red');

        await interaction.reply({ embeds: [embed] });
    }
};