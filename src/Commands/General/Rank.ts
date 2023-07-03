import { BaseCommand, Command, Message } from '../../Structures'
import { Rank } from 'canvacord'
import { getStats } from '../../lib'

@Command('rank', {
    description: "Displays user's rank",
    category: 'general',
    exp: 10,
    cooldown: 20,
    usage: 'rank [tag/quote user]'
})
export default class command extends BaseCommand {
    override execute = async ({ reply, sender, quoted, mentioned }: Message): Promise<void> => {
        const users = mentioned
        if (quoted && !users.includes(quoted.sender.jid)) users.push(quoted.sender.jid)
        while (users.length < 1) users.push(sender.jid)
        const { experience, tag, username: name, level } = await this.client.DB.getUser(users[0])
        let username: string = this.client.contact.getContact(users[0]).username
        if (users[0] === sender.jid) username = sender.username
        if (name.custom) username = name.name as string
        let pfp!: Buffer
        try {
            pfp = await this.client.utils.getBuffer((await this.client.profilePictureUrl(users[0], 'image')) || '')
        } catch (error) {
            pfp = await this.client.utils.getBuffer(
                'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'
            )
        }
        const { requiredXpToLevelUp, rank: RANK } = getStats(level)
        const text = `🏮 *Username:* ${username}#${tag}\n\n⭐ *Experience:* ${experience} / ${requiredXpToLevelUp}\n\n🏅 *Rank:* ${RANK}`
        const rank = new Rank()
            .setAvatar(pfp)
            .setCurrentXP(experience)
            .setRequiredXP(requiredXpToLevelUp)
            .setProgressBar(this.client.utils.generateRandomHex(), 'COLOR')
            .setOverlay(this.client.utils.generateRandomHex())
            .setUsername(username || 'User')
            .setDiscriminator((tag as string).length > 4 ? tag.substr(1) : tag)
            .setBackground('COLOR', this.client.utils.generateRandomHex())
            .setLevel(0, '', false)
            .setRank(0, '', false)
        const card = await rank.build({ fontX: 'arial', fontY: 'arial' })
        return void (await reply(card, 'image', undefined, undefined, text))
    }
}
