import { BaseCommand, Command, Message } from '../../Structures'
import { Character } from '@shineiichijo/marika'

@Command('haigusha', {
    description: 'Summons a random anime character to marry',
    cooldown: 15,
    exp: 20,
    category: 'weeb',
    usage: 'haigusha || haigusha --waifu || haigusha --husbando'
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        await new Character()
            .getRandomCharacter()
            .then(async (chara) => {
                //const chara = data[0]
                let source!: string
                await new Character()
                    .getCharacterAnime(chara.mal_id)
                    .then((res) => (source = res.data[0].anime.title))
                    .catch(async () => {
                        await new Character()
                            .getCharacterManga(chara.mal_id.toString())
                            .then((res) => (source = res.data[0].manga.title))
                            .catch(() => (source = ''))
                    })
                let text = `💙 *Name:* ${chara.name}\n💚 *Nicknames:* ${chara.nicknames.join(
                    ', '
                )}\n💛 *Source:* ${source}`
                if (chara.about !== null) text += `\n\n❤ *Description:* ${chara.about}`
                const image = await this.client.utils.getBuffer(chara.images.jpg.image_url)
                this.handler.haigushaResponse.set(M.from, chara)
                return void (await M.reply(image, 'image', undefined, undefined, text, undefined, {
                    title: chara.name,
                    mediaType: 1,
                    thumbnail: image,
                    sourceUrl: chara.url
                }))
            })
            .catch(async () => {
                return await this.execute(M)
            })
    }
}
