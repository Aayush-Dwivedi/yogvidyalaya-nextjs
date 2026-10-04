import { Schema, model, Document, models, Model } from 'mongoose';
import { StorageFolder } from '../services/storage/storage.interface';

export interface IMediaAsset extends Document {
  path: string;
  bucket: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  publicUrl: string;
  folder: StorageFolder;
  alt?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaAssetSchema = new Schema<IMediaAsset>(
  {
    path: {
      type: String,
      required: [true, 'Storage path is required'],
      unique: true,
      trim: true,
      index: true,
    },
    bucket: {
      type: String,
      required: [true, 'Bucket name is required'],
      trim: true,
    },
    originalFilename: {
      type: String,
      required: [true, 'Original filename is required'],
      trim: true,
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      trim: true,
    },
    size: {
      type: Number,
      required: [true, 'File size in bytes is required'],
    },
    publicUrl: {
      type: String,
      required: [true, 'Public URL is required'],
      trim: true,
    },
    folder: {
      type: String,
      enum: [
        'hero',
        'courses',
        'workshops',
        'gallery',
        'founder',
        'institute',
        'videos',
        'site-assets',
        'general',
      ],
      default: 'general',
      index: true,
    },
    alt: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

MediaAssetSchema.index({ originalFilename: 'text', alt: 'text' });

export const MediaAsset = (models.MediaAsset as Model<IMediaAsset>) || model<IMediaAsset>('MediaAsset', MediaAssetSchema);
