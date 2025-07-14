import mongoose, { Schema, Document } from "mongoose";

export interface IBookmark extends Document {
  url: string;
  title: string;
  favicon: string;
  summary: string;
  tags: string[];
  order: number;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BookmarkSchema: Schema = new Schema({
  url: {
    type: String,
    required: [true, "URL is required"],
    trim: true,
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  favicon: {
    type: String,
    default: "",
  },
  summary: {
    type: String,
    default: "",
  },
  tags: {
    type: [String],
    default: [],
  },
  order: {
    type: Number,
    default: 0,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Bookmark || mongoose.model<IBookmark>("Bookmark", BookmarkSchema);
