import cheerio from 'cheerio'
import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('mi', {
    description: 'Well',
    category: 'chatbot',
    exp: 30,
    cooldown: 5,
    usage: 'mi [Search & Play sounds from https://www.myinstants.com/]'
        
})
export default class extends BaseCommand {
    private baseUrl = 'https://www.myinstants.com'
    private searchUrl = 'https://www.myinstants.com/search/?name='

    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
     const term = context.trim()
       if (!context) return void M.reply('🟥 Search Term is required')
        const url = await this.search(context).catch(() => null)
        if (!url) return void (await M.reply('🟥 No results for "'.concat(context, '"')))
        await M.reply(
            await this.client.utils.getBuffer(url),
            'audio',
            undefined,
            'audio/mpeg',
            undefined,
            undefined,
            undefined,
            undefined,
            `Downloaded by ${this.client.config.session}`
        )
    }

    private search = async (term: string) => {
        const html = await this.client.utils.fetch<string>(this.searchUrl.concat(encodeURI(term)))
        const $ = cheerio.load(html)
        const resultDiv = $('#instants_container')
        const attrs = resultDiv.find($('.instant')).first().find($('.small-button')).first().attr()
        if (!attrs) return null
        return this.getFormatedUrl(attrs.onclick)
    }

    private getFormatedUrl = (url: string) => {
        return this.baseUrl.concat(url.split("'")[1])
    }
}
