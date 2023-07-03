import { BaseCommand, Command, Message } from '../../Structures'

@Command('rules', {
    description: 'shows the rules of the bot',
    usage: 'rules',
    category: 'general',
    exp: 10,
    cooldown: 10
})
export default class command extends BaseCommand {
    override execute = async ({ reply, sender }: Message): Promise<void> => {
        const text = `🎊\n\n_*─☞☛✰✬★✰──🎀𝚁𝚞𝚕𝚎𝚜⌉ 🎀──✾✵✫✯☚☜──*_\n\n☟☟☟☟\n\n➸ Don't neither ask for the Bot Script or to be the Mod/Owner it's illegal🚫\n\n➸ Use &support to get the Official group link in your DM\n\n➸ If you want to chat with Star you can use *&chat (your text)* both are different AI Chat Bots\n\n➸ If you want to add Star Chan in your group the contact the owner by *&owner/&mods* \n\n➸ Dont use wrong command, use the command given in the *help list* \n\n➸ Dont spam the bot with commands if the bot is not responding, its means the bot maybe offline or facing Internet issues. \n\n➸ Dont DM the Bot \n\n➸ If You Don't follow the Rules You will be Banned 🚫 soon \n\n 2.𝖠𝗏𝗈𝗂𝖽 𝖺𝗌𝗄𝗂𝗇𝗀 𝗍𝗁𝖾 𝖻𝗈𝗍 𝖺𝗇𝗒 𝗂𝗇𝗌𝗎𝗅𝗍𝗌/𝗇𝗎𝖽𝗂𝗍𝗒 𝖼𝗈𝗇𝗍𝖾𝗇𝗍.(𝖡𝖺𝗇)\n\n 3.𝖠𝗏𝗈𝗂𝖽 𝖼𝗁𝖺𝗍𝗍𝗂𝗇𝗀 𝗍𝗁𝖾 𝖻𝗈𝗍 𝗂𝗇 𝗉𝖾𝗋𝗌𝗈𝗇𝖺𝗅 𝗆𝖾𝗌𝗌𝖺𝗀𝖾, 𝖮𝖭𝖫𝖸 𝗀𝗋𝗈𝗎𝗉 𝗅𝗂𝗇𝗄𝗌 𝖺𝗅𝗅𝗈𝗐𝖾𝖽.(𝖡𝗅𝗈𝖼𝗄)\n\n 4.𝖴𝗌𝖾 ${this.client.config.prefix}𝗌𝗎𝗉𝗉𝗈𝗋𝗍`
        const buffer = await this.client.utils.getBuffer('https://telegra.ph/file/5c41e96fea205e85d2b20.mp4')
        return void (await reply(buffer, 'video', true, undefined, text))
    }
}
