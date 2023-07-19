import { BaseCommand, Command, Message } from '../../Structures'
import { getStats } from '../../lib'

@Command('profile', {
    description: "Displays user's profile",
    category: 'general',
    exp: 25,
    cooldown: 15,
    aliases: ['p'],
    usage: 'profile [tag/quote user]'
})
export default class command extends BaseCommand {
    override execute = async ({ mentioned, quoted, sender, reply, groupMetadata }: Message): Promise<void> => {
        const users = mentioned
        if (quoted && !users.includes(quoted.sender.jid)) users.push(quoted.sender.jid)
        while (users.length < 1) users.push(sender.jid)
        let pfp!: Buffer
        try {
            pfp = await this.client.utils.getBuffer((await this.client.profilePictureUrl(users[0], 'image')) || '')
        } catch (error) {
            pfp = this.client.assets.get('404') as Buffer
        }
        let type: 'image' | 'video' = 'image'
        const info = await this.client.DB.getUser(users[0])
        if (info.icon.custom) {
            const icon = info.icon.url as string
            const splittedUrl = icon.split('.')
            if (splittedUrl[splittedUrl.length - 1] === 'mp4') type = 'video'
            pfp = await this.client.utils.getBuffer(icon)
        }
        let username: string = this.client.contact.getContact(users[0]).username
        if (users[0] === sender.jid) username = sender.username
        if (info.username.custom) username = info.username.name as string
        const haigusha = info.haigusha.married ? info.haigusha.data?.name : 'None'
        const admin = this.client.utils.capitalize(`${groupMetadata?.admins?.includes(users[0]) || false}`)
        const ban = !info.banned || info.banned === null ? 'False' : 'True'
        const { rank } = getStats(info.level)
        let bio!: string
        try {
            bio = (await this.client.fetchStatus(users[0]))?.status || ''
        } catch (error) {
            bio = ''
        }
        if (info.about?.custom) bio = info.about.bio as string
        const text = `🏮 *Username:* ${username}#${info.tag}\n\n♧︎︎︎ *Bio:* ${bio}\n\n𓀬 *Experience:* ${
            info.experience || 0
        }\n\n🏅 *Rank:* ${rank}\n\nꕥ *Companion:* ${this.client.utils.capitalize(
            info.companion
        )}\n\n♔︎ *Quiz Wins:* ${
            info.quizWins
        }\n\n👑 *Admin:* ${admin}\n\n⚠︎ *Banned:* ${ban || 'False'}\n\nꕥ 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿 𝙱𝙾𝚃`
        return void (await reply(pfp, type, type === 'video' ? true : undefined, undefined, text))
    }
}
