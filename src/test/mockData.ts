import type { Comment, Post } from '../api/posts'

export const firstPost: Post = {
  id: 1,
  userId: 1,
  title: 'First post',
  body: 'An apple a day',
}

export const secondPost: Post = {
  id: 2,
  userId: 1,
  title: 'Second post',
  body: 'An orange a day',
}

export const firstComment: Comment = {
  id: 10,
  postId: 1,
  name: 'Great post',
  email: 'reader@example.test',
  body: 'Thanks for sharing.',
}

export const secondComment: Comment = { ...firstComment, id: 11, postId: 2 }
