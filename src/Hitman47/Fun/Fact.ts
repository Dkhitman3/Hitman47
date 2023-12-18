import { BaseCommand, Command, Message } from '../../Structures';
import { IArgs } from '../../Types';
import axios from 'axios';

@Command('fact', {
    description: 'Get a random fact.',
    aliases: ['facts'],
    category: 'fun',
    usage: 'fact',
    cooldown: 5,
    exp: 30,
    dm: false
})
  export default class FactCommand extends BaseCommand {
    public override async execute(M: Message, args: IArgs): Promise<void> {
        try {
            const response = await axios.get('https://nekos.life/api/v2/fact');
            const fact = response.data.fact;
            const text = `📛 *Fact:* ${fact}`;
            M.reply(text);
        } catch (err) {
            M.reply('✖ An error occurred.');
        }
    }
}
