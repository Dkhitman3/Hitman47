import { BaseCommand, Command, Message } from '../../Structures'

@Command('blowjob', {
    description: 'Get the blowjob',
    category: 'nsfw',
    aliases: ['blowjob'],
    usage: 'blowjob',
    cooldown: 5,
    exp: 100
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const buffer = await this.client.utils.getBuffer('https://telegra.ph/file/3d865b5d7451ae761adcd.mp4')
        let text = ''
        text += `🍑here you go\n\n`
        return void (await M.reply(buffer, 'video', true, undefined, text))
    }
}
