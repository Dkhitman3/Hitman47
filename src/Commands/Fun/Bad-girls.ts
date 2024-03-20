import { join } from 'path'
import { BaseCommand, Command, Message } from '../../Structures'

@Command('bad-girl ', {
    description: "nudes",
    usage: 'Bad-girl',
    aliases: ['bg'],
    category: 'fun',
    cooldown: 10,
    exp: 100
})
export default class extends BaseCommand {
    private imageUrls: string[] = [
        'https://telegra.ph/file/79643e501e65459fd71bb.jpg',
        'https://telegra.ph/file/20321ec84f30c6a8c61d6.jpg',
        'https://telegra.ph/file/2a53cfe11be1c3e634d5b.jpg',
        'https://telegra.ph/file/3fc612088ad3b6614c688.jpg',
        'https://telegra.ph/file/275ea398dff172ce3cbf2.jpg',
        'https://telegra.ph/file/120ce7c0226d3470918b7.jpg',
        'https://telegra.ph/file/4b506d1ecf7aee62ac028.jpg',
        'https://telegra.ph/file/e6d6dbdb0ece4c8440ff2.jpg',
        'https://telegra.ph/file/efc213ae8019e1b548106.jpg',
        'https://telegra.ph/file/ad1324b0714b92259c642.jpg',
        'https://telegra.ph/file/e593604858b55d91c5d16.jpg',
        'https://telegra.ph/file/0512ad6b51266798e060f.jpg',
        'https://telegra.ph/file/fcbf113a33b17de128956.jpg',
        'https://telegra.ph/file/4fc4c3c01ddd7d783ecb7.jpg',
    ]
    // you can add more pictures if you want bro or girl
    public override execute = async ({ reply }: Message): Promise<void> => {
        const users = await this.client.DB.user.count()
        let getGroups = await this.client.groupFetchAllParticipating()
        let groups = Object.entries(getGroups)
            .slice(0)
            .map((entry) => entry[1])
        let res = groups.map((v) => v.id)
        console.log(res.length)
        const { description, name, homepage } = require(join(__dirname, '..', '..', '..', 'package.json')) as {
            description: string
            homepage: string
            name: string
        }
        const randomImageUrl = this.imageUrls[Math.floor(Math.random() * this.imageUrls.length)]
        const image = await this.client.utils.getBuffer(randomImageUrl)
        const uptime = this.client.utils.formatSeconds(process.uptime())
        const text = `*Came to take it love 🤭,I need your dick to fuck me in my fucknnn🤭pussy🤤*`
        return void (await reply(image, 'image', undefined, undefined, text, undefined, {
            title: this.client.utils.capitalize(name),
            thumbnail: image,
            mediaType: 1,
            sourceUrl: homepage
        }))
    }
}