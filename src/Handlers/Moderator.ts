import { delay } from '@whiskeysockets/baileys'
import { Client } from '../Structures'

export class ModHandler {
    constructor(private client: Client) {}

    public loadMods = async (): Promise<void> => {
        if (this.client.config.adminsGroup === '') return void null
        this.client.log('Loading Moderators...')
        await delay(5000)
        const { participants } = await this.client.groupMetadata(this.client.config.adminsGroup)
        this.client.config.mods = participants
            .filter((participant) => participant.admin !== null && participant.admin !== undefined)
            .map(({ id }) => id)
        this.client.log(`Successfully loaded ${this.client.config.mods.length} Moderators`)
    }
}
