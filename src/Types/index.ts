import Baileys, { GroupMetadata, ParticipantAction } from '@whiskeysockets/baileys'

export * from './Config'
export * from './Command'
export * from './Message'

export interface IContact {
    jid: string
    username: string
    isMod: boolean
}

export interface ISender extends IContact {
    isAdmin: boolean
}

export interface ICall {
    content: {
        attrs: {
            'call-creator': string
        }
        tag: string
    }[]
}

export interface IEvent {
    jid: string
    participants: string[]
    action: ParticipantAction
}

export interface YT_Search {
    type: string
    videoId: string
    url: string
    title: string
    description: string
    image: string
    thumbnail: string
    seconds: number
    timestamp: string
    duration: {
        seconds: number
        timestamp: string
    }
    ago: string
    views: number
    author: {
        name: string
        url: string
    }
}

export enum GroupFeatures {
    'events' = 'By enabling this feature, the bot will welcome new members, gives farewell to the members who left the group or were removed and reacts when a member is promoted or demoted'
}

export interface IGroup extends GroupMetadata {
    admins?: string[]
}

export type client = ReturnType<typeof Baileys>
