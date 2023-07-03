import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs, TGroupFeature } from '../../Types'

@Command('disable', {
    description: 'Disables a feature of a group',
    category: 'moderation',
    exp: 10,
    cooldown: 10,
    usage: 'disable [feature]'
})
export default class command extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) return void M.reply('*Provide the feature that you wanna disable*')
        const feature: TGroupFeature = context.split(' ')[0].toLowerCase().trim() as TGroupFeature
        if (!this.features.includes(feature)) return void M.reply('*Invalid option*')
        const group = await this.client.DB.getGroup(M.from)
        if (!group[feature])
            return void M.reply(`🟨 *${this.client.utils.capitalize(feature)}* is already disabled, Baka!`)
        await this.client.DB.updateGroup(M.from, feature, false)
        if (feature === 'events' || feature === 'wild' || feature === 'chara') {
            const i = feature === 'wild' ? 'wild' : feature === 'chara' ? 'chara' : 'wild'
            const index = this.handler[i].findIndex((x) => x === M.from)
            this.handler[i]['splice'](index, 1)
        }
        return void M.reply(`🟥 *${this.client.utils.capitalize(feature)}* is now disabled`)
    }

    private features: TGroupFeature[] = ['events', 'mods', 'chara', 'wild', 'nsfw']
}
