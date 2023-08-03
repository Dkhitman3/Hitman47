import { BaseCommand, Command, Message } from '../../Structures'

@Command('demote', {
    description: 'removing people as an admin',
    category: 'moderation',
    usage: 'demote',
    exp: 10,
    cooldown: 10
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender.jid)
        M.mentioned = [...new Set(M.mentioned)]
        if (M.mentioned.length === 0) return void (await M.reply(`🟥 *Mentions are required to demote*`))
        if (M.mentioned.length > 5)
            M.reply(`🟥 *You can only demote up to 5 users at a time, Remove some users and try again*`)
        let text = `🎖️ Demoting Users...\n`
        for (const jid of M.mentioned) {
            const number = jid.split('@')[0]
            if (!M.group?.admins?.includes(jid)) text += `\n🟨 *@${number}* is already an not admin`
            else {
                await this.client.groupParticipantsUpdate(M.from, [jid], 'demote')
                text += `\n🟩 Demoted *@${number}*`
            }
        }
        await M.reply(text, undefined, undefined, undefined, M.mentioned)
    }
 }

