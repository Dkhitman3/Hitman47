import { prop, getModelForClass } from '@typegoose/typegoose'
import { Document } from 'mongoose'
import { ICharacter, ICharacter as WaifuResponse } from '@shineiichijo/marika'

export class Pokemon {
    @prop({ type: String, required: true })
    public name!: string

    @prop({ type: String, required: true })
    public image!: string

    @prop({ type: Number, required: true })
    public id!: number

    @prop({ type: Number, required: true })
    public level!: number
}

class Gallery implements ICharacter {
    @prop({ required: true })
    public mal_id!: ICharacter['mal_id']

    @prop({ type: String, required: true })
    public url!: string

    @prop({ type: Object, required: true })
    public images!: ICharacter['images']

    @prop({ type: String, required: true })
    public name!: string

    @prop({ type: () => [String], required: true, default: [] })
    public nicknames!: string[]

    @prop({ type: String, required: true })
    public about!: string

    @prop({ required: true })
    public favorites!: number
}

class Inventory {
    @prop({ type: String, required: true })
    public item!: string

    @prop({ type: Number, required: true })
    public usageLeft!: number
}

class Icon {
    @prop({ type: Boolean, required: true, default: false })
    public custom!: boolean

    @prop({ type: String })
    public hash?: string

    @prop({ type: String })
    public url?: string
}

class Username {
    @prop({ type: Boolean, required: true, default: false })
    public custom!: boolean

    @prop({ type: String })
    public name?: string
}

class About {
    @prop({ type: Boolean, required: true, default: false })
    public custom!: boolean

    @prop({ type: String })
    public bio?: string
}

class Haigusha {
    @prop({ type: Boolean, required: true, default: false })
    public married!: boolean

    @prop({ type: Object, required: true, default: () => ({}) })
    public data!: WaifuResponse
}

export class UserSchema {
    @prop({ type: String, required: true, unique: true })
    public jid!: string

    @prop({ type: Number, required: true, default: 0 })
    public experience!: number

    @prop({ type: Boolean, required: true, default: false })
    public banned!: boolean

    @prop({ type: Number, required: true, default: 1 })
    public level!: number

    @prop({ type: String, required: true })
    public tag!: string

    @prop({ type: Number, required: true, default: 0 })
    public wallet!: number

    @prop({ type: Number, required: true, default: 0 })
    public bank!: number

    @prop({ type: Number, required: true, default: 0 })
    public quizWins!: number

    @prop({ type: () => Haigusha, required: true, default: () => ({ married: false, data: {} }) })
    public haigusha!: Haigusha

    @prop({ type: () => Icon, required: true, default: () => ({ custom: false }) })
    public icon!: Icon

    @prop({ type: Number, required: true, default: 0 })
    public lastDaily!: number

    @prop({ type: Number, required: true, default: 0 })
    public lastRob!: number

    @prop({ type: () => About, required: true, default: () => ({ custom: false }) })
    public about!: About

    @prop({ type: () => Username, required: true, default: () => ({ custom: false }) })
    public username!: Username

    @prop({ type: () => Inventory, required: true, default: [] })
    public inventory!: Inventory[]

    @prop({ type: String, required: true, default: 'None' })
    public companion!: string

    @prop({ type: () => Pokemon, required: true, default: [] })
    public party!: Pokemon[]

    @prop({ type: () => Pokemon, required: true, default: [] })
    public pc!: Pokemon[]

    @prop({ type: () => Gallery, required: true, default: [] })
    public gallery!: Gallery[]
}

export type TUserModel = UserSchema & Document

export const userSchema = getModelForClass(UserSchema)
