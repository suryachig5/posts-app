import classNames from 'classnames'
import { useNavigate, useParams } from 'react-router-dom'

import type { Comment, Post } from '../../api/posts'
import { isNotFound } from '../../api/posts'
import { CommentList } from '../../components/CommentList/CommentList'
import { FavoriteButton } from '../../components/FavoriteButton/FavoriteButton'
import { CommentListSkeleton } from '../../components/LoadingSkeletons/CommentListSkeleton'
import { PostDetailsSkeleton } from '../../components/LoadingSkeletons/PostDetailsSkeleton'
import { RetryNotice } from '../../components/RetryNotice/RetryNotice'
import { usePostDetails } from '../../hooks/usePostDetails'
import { useFeedFilter } from '../../store/feedFilter'
import { PostDetailsLayout } from './PostDetailsLayout'

import sharedStyles from '../../styles/shared.module.scss'
import styles from './PostDetailsPage.module.scss'

interface PostArticleProps {
  post: Post
}

interface PostCommentsProps {
  comments?: Comment[]
  failed: boolean
  retrying: boolean
  retry: () => void
}

/** Renders a post and its comments using the ID from the route. */
export default function PostDetailsPage() {
  const { postId = '' } = useParams()
  const parsedId = postId.trim() === '' ? NaN : Number(postId)
  return (
    <PostDetailsLayout>
      <PostDetailsContent postId={parsedId} />
    </PostDetailsLayout>
  )
}

function PostDetailsContent({ postId }: { postId: number }) {
  const {
    post: postQuery,
    comments: commentsQuery,
    enabled,
  } = usePostDetails(postId)
  const { data: post, error, isPending, isFetching, refetch } = postQuery

  if (!enabled || (!post && isNotFound(error))) return <h1>Post not found</h1>
  if (!post && isPending) return <PostDetailsSkeleton />
  if (!post) {
    return (
      <RetryNotice
        message="We couldn’t load this post."
        retry={refetch}
        retrying={isFetching}
      />
    )
  }

  return (
    <>
      <PostArticle post={post} />
      <PostComments
        comments={commentsQuery.data}
        failed={commentsQuery.isError}
        retrying={commentsQuery.isFetching}
        retry={commentsQuery.refetch}
      />
    </>
  )
}

function PostArticle({ post }: PostArticleProps) {
  const { id, title, body, userId } = post
  const navigate = useNavigate()
  const showPostsByUser = useFeedFilter((state) => state.showPostsByUser)

  return (
    <article className={styles.card}>
      <div className={styles.heading}>
        <h1>{title}</h1>
        <FavoriteButton postId={id} title={title} />
      </div>
      <p className={sharedStyles.postUser}>Posted by User {userId}</p>
      <p className={styles.body}>{body}</p>
      <button
        className={sharedStyles.textButton}
        type="button"
        onClick={openUserFeed}
      >
        More posts by this user
      </button>
    </article>
  )

  function openUserFeed() {
    showPostsByUser(userId)
    void navigate('/')
  }
}

function PostComments(props: PostCommentsProps) {
  const { comments } = props

  return (
    <section className={styles.comments} aria-labelledby="comments-heading">
      <div className={classNames(styles.heading, sharedStyles.sectionHeading)}>
        <h2 id="comments-heading">Comments</h2>
        {comments && (
          <span
            className={styles.count}
            aria-label={`${comments.length} comments`}
          >
            {comments.length}
          </span>
        )}
      </div>
      <PostCommentsContent {...props} />
    </section>
  )
}

function PostCommentsContent(props: PostCommentsProps) {
  const { comments, failed, retrying, retry } = props
  if (!comments && failed) {
    return (
      <RetryNotice
        message="We couldn’t load comments."
        retry={retry}
        retrying={retrying}
      />
    )
  }
  if (!comments) return <CommentListSkeleton />

  return <CommentList comments={comments} />
}
