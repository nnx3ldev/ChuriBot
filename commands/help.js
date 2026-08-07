const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Muestra la lista de comandos disponibles del bot.'),
    
    async execute(interactionOrMessage) {
        const embed = new EmbedBuilder()
            .setTitle('📖 Centro de Ayuda - ChuriBot')
            .setDescription('Aquí tienes la lista de comandos principales para la comunidad de gaming y social. Puedes usarlos con barra diagonal (`/`) o con el prefijo `nn!`.')
            .addFields(
                { 
                    name: '🎮 Interacción y Social', 
                    value: '`/duo` - Analiza la sinergia competitiva entre dos usuarios.\n`/aura` - Mide el nivel de aura actual.\n`/profile` - Muestra o edita tu tarjeta de perfil social y de juego.' 
                },
                { 
                    name: '🛠️ Utilidad y Anuncios', 
                    value: '`/embed` - Constructor profesional de embeds con imágenes y archivos.\n`/ping` - Revisa la latencia y retraso de red del bot.\n`/decidir` - Ayuda a tomar decisiones rápidas.' 
                },
                { 
                    name: '🛡️ Moderación y Admin', 
                    value: '`/clear` - Borra mensajes masivamente.\n`/staffmode` - Bloquea canales exclusivamente para administradores.\n`/reactionrole` - Configura roles automáticos por reacción.' 
                }
            )
            .setColor('Blurple')
            .setFooter({ text: 'ChuriBot • Servidor Social & Gaming' });

        await interactionOrMessage.reply({ embeds: [embed] });
    }
};