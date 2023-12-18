import { Anime } from '@shineiichijo/marika';
import { BaseCommand, Command, Message } from '../../Structures';
import { IArgs } from '../../Types';

@Command('anime', {
    description: 'Searches an anime of the given query in MyAnimeList',
    aliases: ['ani'],
    category: 'anime',
    usage: 'anime [query]',
    exp: 20,
    cooldown: 20
})
export default class AnimeCommand extends BaseCommand {
    public override async execute(M: Message, { context }: IArgs): Promise<void> {
        if (!context) {
            return void M.reply('Provide a query for the search, Baka!');
        }

        const query = context.trim();

        try {
            const { data } = await new Anime().searchAnime(query);
            const result = data[0];

            let text = `🎉 *Title:* ${result.title}\n📺 *Format:* ${result.type}\n`;

            // Include other relevant information here in a similar format

            if (result.background !== null) {
                text += `🎆 *Background:* ${result.background}\n\n`;
            }

            text += `📝 *Description:* ${result.synopsis}`;

          const image = await this.client.utils.getBuffer(result.images.jpg.large_image_url)
      await M.reply(image, 'image', undefined, undefined, text, undefined, {
                title: result.title,
                mediaType: 1,
                thumbnail: image,
                sourceUrl: result.url
            });
        } catch (error) {
            await M.reply(`Couldn't find any anime | *"${query}"*`);
        }
    }
}
