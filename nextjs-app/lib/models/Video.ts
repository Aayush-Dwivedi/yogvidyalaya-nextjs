import { Schema, model, Document, models, Model } from 'mongoose';
import { StorageImageSchema } from './common.schema';
import { IStorageImage, ContentStatus } from '../types/content.types';

export interface IVideo extends Document {
  youtubeUrl: string;
  youtubeVideoId: string;
  title: string;
  description?: string;
  thumbnail?: IStorageImage;
  category: string;
  speaker?: string;
  duration?: string;
  featured: boolean;
  order: number;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>(
  {
    youtubeUrl: {
      type: String,
      required: [true, 'YouTube URL is required'],
      trim: true,
    },
    youtubeVideoId: {
      type: String,
      required: [true, 'YouTube video ID is required'],
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Video title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: StorageImageSchema,
    },
    category: {
      type: String,
      default: 'Discourse',
      trim: true,
      index: true,
    },
    speaker: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

VideoSchema.index({ title: 'text', description: 'text', speaker: 'text' });

export const Video = (models.Video as Model<IVideo>) || model<IVideo>('Video', VideoSchema);
