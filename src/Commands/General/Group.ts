import { Command, BaseCommand, Message } from '../../Structures'

@Command('group', {
    description: 'Get Group information',
    usage: 'group',
    category: 'general',
    exp: 10
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        if (!M.groupMetadata) return void M.reply('*Try Again*')
        const { id, subject, owner, participants, admins } = M.groupMetadata
        const { nsfw, mods, wild, chara, events } = await this.client.DB.getGroup(id)
        let pfpUrl: string | undefined
        try {
            pfpUrl = await this.client.profilePictureUrl(id, 'image')
        } catch {
            pfpUrl = undefined
        }
        const pfp = pfpUrl ? await this.client.utils.getBuffer(pfpUrl) : (this.client.assets.get('404') as Buffer)
        let text = ''
        text += `*ID*: ${id}\n`
        text += `*Subject*: ${subject}\n`
        text += `*Owner*: ${owner}\n`
        text += `*Participants*: ${participants.length}\n`
        text += `*Admins*: ${admins?.length ?? 0}\n`
        text += `*NSFW*: ${nsfw}\n` 
        text += `*Mods*: ${mods}\n`
        text += `*Wild*: ${wild}\n`
        text += `*Chara*: ${chara}\n`
        text += `*Events*: ${events}`
        return void (await M.reply(
            pfp,
            'image',
            undefined,
            undefined,
            text
        ))
    }
 }
