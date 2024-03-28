import { BaseCommand, Command, Message } from '../../Structures';
import { IArgs } from '../../Types';

export interface Valstat<T> {
    status: number;
    data: T;
}
export interface Stats {
    puuid: string;
    region: string;
    account_level: number;
    name: string;
    tag: string;
    card: Card;
    last_update: string;
    last_update_raw: number;
}
export interface Card {
    small: string;
    large: string;
    wide: string;
    id: string;
}

export interface Rank {
    currenttier: number;
    currenttierpatched: string;
    images: Images;
    ranking_in_tier: number;
    mmr_change_to_last_game: number;
    elo: number;
    name?: null;
    tag?: null;
    old: boolean;
}
export interface Images {
    small: string;
    large: string;
    triangle_down: string;
    triangle_up: string;
}

@Command('valstats', {
    description: 'get valstats',
    aliases: ['va'],
    category: 'cards',
    usage: 'valorant',
    exp: 10,
    cooldown: 5
})
export default class command extends BaseCommand {
    private baseurl = 'https://api.henrikdev.xyz/valorant/v1/';

    override execute = async (M: Message, { context, flags }: IArgs): Promise<void> => {
    const [username, tag] = context.split('#');
    if (!username || !tag) return void (await M.reply('🟥 Username and Tag are required'));

    let region = 'ap'; // Default region in case 'r' flag is not present or incorrect
    if (flags && typeof flags === 'object' && 'r' in flags) {
        region = flags.r as string; // Set the region from the 'r' flag
    }
        const stats = await this.client.utils
        .fetch<Valstat<Stats>>(this.baseurl.concat('account/', username, '/', tag))
        .catch(() => null);

    if (!stats) return void (await M.reply('🟥 Username/Tag is incorrect'));

    const rank = await this.client.utils
        .fetch<Valstat<Rank>>(this.baseurl.concat('mmr/', region, '/', username, '/', tag))
        .catch(() => null);

    if (!rank) return void (await M.reply('🟥 An error occurred. Try again later'));
        
        await this.client.sendMessage(M.from, {
            image: await this.client.utils.getBuffer(stats.data.card.large),
            footer: 'Well',
            caption: `
                🧧 *Player ID:* ${stats.data.name}#${stats.data.tag}
                🌎 *Region:* ${stats.data.region.toUpperCase()}
                🚀 *Level:* ${stats.data.account_level}
                👑 *Rank:* ${rank.data.currenttierpatched}
                🃏 *Elo:* ${rank.data.elo}
            `,
            linkPreview: {
                title: username,
                'canonical-url': 'https://playvalorant.com',
                'matched-text': 'https://playvalorant.com',
                description: rank.data.currenttierpatched,
                jpegThumbnail: await this.client.utils.getBuffer(rank.data.images.large)
            }
        });
    }
  }

