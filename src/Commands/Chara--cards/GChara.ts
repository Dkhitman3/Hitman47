import { Message, Command, BaseCommand } from '../../Structures'

@Command('gchara', {
    description: 'gives chara to people',
    usage: 'gchara [index of gallery]',
    exp: 10,
    cooldown: 10,
    category: 'characters'
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const { gallery } = await this.client.DB.getUser(M.sender.jid)
        if (!gallery.length) return void M.reply('no claimed charas')
        if (!M.numbers.length || M.numbers[0] < 1 || M.numbers[0] > gallery.length)
            return void M.reply('provide a valid gallery index to give with tagged or quoted person')
        const user = M.mentioned.length ? M.mentioned[0] : M.quoted ? M.quoted.sender.jid : ''
        if (user === '') return void M.reply('tag or quote a user')
        const t = gallery[M.numbers[0] - 1]
        const { gallery: Gallery } = await this.client.DB.getUser(user)
        Gallery.push(t)
        gallery.splice(M.numbers[0] - 1, 1)
        await this.client.DB.updateUser(M.sender.jid, 'gallery', 'set', gallery)
        await this.client.DB.updateUser(user, 'gallery', 'set', Gallery)
        return void M.reply(
            `@${M.sender.jid.split('@')[0]} gave ${t.name} to @${user.split('@')[0]}`,
            'text',
            undefined,
            user,
            undefined,
            [M.sender.jid, user]
        )
    }
}
