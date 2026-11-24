export interface Review {
  id: string;
  listingId: string;
  authorUid: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewInput {
  rating: number;
  comment: string;
}
