import { Command, BaseCommand, Message } from '../../Structures'

@Command('group', {
    description: "fuckes  the group info",
    usage: 'group',
    category: 'general',
    exp: 10
})
export default class command extends BaseCommand {
    override execute = async ({ reply }: Message): Promise<void> => {
        const url =
            (await this.client.profilePictureUrl(M.from).catch(() => null)) ??
            'https://link'
        const info = await this.client.database.getGroup(M.from)
        const users = await this.client.DB.user.find({})
        
            await M.reply({
            image: { url },
            jpegThumbnai: image.toString('base64'),
            caption: text`
                🏷️ *Group Subject:* ${M.group?.metadata.subject ?? 'N/A'}

                👿 *Admins:* ${M.group?.admins.length ?? 0}

                🧧 *Total Members ugly:* ${M.group?.participants.length ?? 0}

                ❤️ *Group Description:*\n${group.description}
        
            }\n\n🎇*Users:* ${users.length}`
        ))
    }
}
