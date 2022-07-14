import { Schema, model } from "mongoose";

interface ICard {
  idm: string,
  id: number,
  enable: boolean,
  expire: Date,
	remark: string,
	banDevids?: number[]
}

const cardSchema = new Schema<ICard>({
	idm: { type: String, required: true },
  id: { type: Number, required: true },
  enable: { type: Boolean, required: true },
  expire: { type: Date, required: true },
  remark: { type: String, required: true },
  banDevids: [Number],
});

const Card = model<ICard>('Card', cardSchema, 'card');
export default Card;