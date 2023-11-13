import { prop, getModelForClass } from '@typegoose/typegoose'
import { Document } from 'mongoose'

class Ban {
    @prop({ type: Boolean, required: true, default: false })
    public banned!: boolean

    @prop({ type: String })
    public reason?: string

    @prop({ type: String })
    public bannedBy?: string

    @prop({ type: String })
    public bannedIn?: string

    @prop({ type: String })
    public time?: string  
}

export class UserSchema {
    @prop({ type: String, required: true, unique: true })
    public jid!: string

    @prop({ type: Number, required: true, default: 0 })
    public experience!: number

    @prop({ type: Number, required: true, default: 1 })
    public level!: number

    @prop({ type: String, required: true })
    public tag!: string
}

export type TUserModel = UserSchema & Document

export const userSchema = getModelForClass(UserSchema)
