import { prop, getModelForClass } from '@typegoose/typegoose'
import { Document } from 'mongoose'

export class FeatureSchema {
    @prop({ type: String, unique: true, required: true })
    public feature!: string

    @prop({ type: Boolean, required: true, default: false })
    public state!: boolean

    @prop({ type: () => Items, required: true })
    public items!: Items[]
}

class Items {
    @prop({ type: Number, required: true })
    public id!: number

    @prop({ type: String, required: true })
    public emoji!: string

    @prop({ type: String, required: true })
    public name!: string

    @prop({ type: Number, required: true })
    public description!: string

    @prop({ type: Number, required: true })
    public usageLimit!: number

    @prop({ type: Number, required: true })
    public price!: number
}

export type TFeatureModel = FeatureSchema & Document

export const featureSchema = getModelForClass(FeatureSchema)
