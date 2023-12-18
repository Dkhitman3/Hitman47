import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs, TGroupFeature } from '../../Types'

@Command('enable', {
    description: 'Enables a certain feature of a group',
    category: 'moderation',
    usage: 'enable [feature]',
    exp: 10,
    cooldown: 10
})
export default class CommandEnable extends BaseCommand {
    override async execute(M: Message, { context }: IArgs): Promise<void> {
        if (!context) {
            let text = `♻ *Available Features* ♻`
            for (const info of this.info) {
                text += `\n\n${info.emoji} *${this.client.utils.capitalize(info.feature)}* ${
                    info.emoji
                }\n📄 *Description:* ${info.description}\n🎗 *TODO:* ${this.client.config.prefix}enable ${info.feature}`
            }
            return void M.reply(text)
        }
        const feature = context.split(' ')[0].toLowerCase().trim() as TGroupFeature
        if (this.info.findIndex((x) => x.feature === feature) < 0) {
            return void M.reply(`*Invalid option.* Use *${this.client.config.prefix}enable* to see all of the available features`)
        }
        const group = await this.client.DB.getGroup(M.from)
        if (group[feature])
            return void M.reply(`🟨 *${this.client.utils.capitalize(feature)}* is already enabled, Baka!`)
        await this.client.DB.updateGroup(M.from, feature, true)
        if (feature === 'mods' || feature === 'porn' || feature === 'events') {
            const i = feature === 'mods' ? 'mods' : feature === 'events' ? 'events' : 'porn'
            this.handler[i].push(M.from)
        }
        return void M.reply(`🟩 *${this.client.utils.capitalize(feature)}* is enabled`)
    }

    private info: IGroupFeatureInfo[] = [
        {
            feature: 'mods',
            description:
                'Enables the bot to send news whenever there is an update related to anime, manga or novel stuff',
            emoji: '📰'
        },
        // ... other feature objects ...
    ]
}

interface IGroupFeatureInfo {
    feature: TGroupFeature
    description: string
    emoji: '📰' | '🧧' | '🎐' | '🎡' | '🃏' | '🔰'
}
