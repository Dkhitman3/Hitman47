import { BaseCommand, Command, Message } from '../../Structures'

@Command('endgroup', {
    description: 'remove everyone in the group',
    category: 'dev',
    exp: 5,
    aliases: ['bitch'],
    cooldown: 2,
    usage: 'endgroup'
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (!M.groupMetadata) return void M.reply('*Try Again!*')
        const { participants, owner } = M.groupMetadata
        if (!this.client.config.mods.includes(M.sender.jid)) return void M.reply('only mods')
        if (this.purgeSet.has(M.from)) {
            const arr = participants.map((participant) => participant.id)
            if (arr.includes(M.sender.jid as string)) arr.splice(arr.indexOf(M.sender.jid as string), 1)
            await this.client
                .groupParticipantsUpdate(M.from, arr, 'remove')
                .then(async () => {
                    M.reply('Done')
                    this.purgeSet.delete(M.from)
                    return void (await this.client.groupLeave(M.from))
                })
                .catch(() => {
                    return void M.reply('*Try Again*')
                })
        }
        this.purgeSet.add(M.from)
        M.reply('Are you sure? Do it again if you want to kiss')
        setTimeout(() => {
            if (!this.purgeSet.has(M.from)) return void null
            this.purgeSet.delete(M.from)
        }, 6 * 1000)
    }

    private purgeSet = new Set<string>()
}
