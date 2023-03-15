import { HydratedDocument } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop()
  age: number;

  @Prop({ required: true, index: true, unique: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
