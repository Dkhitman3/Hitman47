import { BaseCommand, Command, Message } from '../../Structures'

@Command('tell', {
    description: 'Says the truth',
    category: 'boss',
    usage: 'tell',
    aliases: ['tell'],
    exp: 25,
    cooldown: 5
})
export default class extends BaseCommand {
    public override execute = async ({ sender, reply }: Message): Promise<void> =>
        void (await reply(`Hello Human! *${sender.username}*`))
}
