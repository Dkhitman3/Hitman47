import { BaseCommand, Command, Message } from '../../Structures'

@Command('ok', {
    description: 'Removes the mentioned/quoted users',
    category: 'dev',
    usage: 'ok [tag_users]',
    cooldown: 10,
    exp: 10
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (!M.groupMetadata) return void M.reply('*Try Again!*')
        const users = M.mentioned
        if (M.quoted && !users.includes(M.quoted.sender.jid)) users.push(M.quoted.sender.jid)
        if (!users.length || users.length < 1)
            return void M.reply('Tag or quote the users that you want to remove from this group, Baka!')
        let text = '🟥 *Removed:*\n'
        let flag = false
        let Text = ''
        const owner = M.groupMetadata.owner
        const bot = `${(this.client.user?.id || '').split('@')[0].split(':')[0]}@s.whatsapp.net`
        const arr = []
        const skipped = []
        for (const user of users) {
            if (owner && user === owner) {
                Text += `Skipped *@${user.split('@')[0]}* as he/she's the group owner\n`
                flag = true
                skipped.push(user)
                continue
            }
            if (user === bot) {
                flag = true
                Text += `I have skipped myself`
                skipped.push(user)
                continue
            }
            arr.push(user)
            text += `\n*@${user.split('@')[0]}*`
        }
        if (flag) M.reply(Text, 'text', undefined, undefined, undefined, skipped)
        if (arr.length < 1)
            return void M.reply(
                `There are no users left to remove as ${
                    users.length > 1 ? "all of them can't be removed" : "the user can't be removed"
                }`
            )
        await this.client.groupParticipantsUpdate(M.from, arr, 'remove')
        return void M.reply(text, 'text', undefined, undefined, undefined, arr)
    }
}
