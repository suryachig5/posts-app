import classNames from 'classnames'
import sharedStyles from '../../styles/shared.module.scss'
import postCardStyles from '../../components/PostCard/PostCard.module.scss'
import styles from './PostDetailsPage.module.scss'
import { useNavigate, useParams } from 'react-router-dom'
import { isNotFound } from '../../api/posts'
import type { Post } from '../../api/posts'
import { CommentList } from '../../components/CommentList/CommentList'
import { CommentListSkeleton } from '../../components/LoadingSkeletons/CommentListSkeleton'
import { FavoriteButton } from '../../components/FavoriteButton/FavoriteButton'
import { RetryNotice } from '../../components/RetryNotice/RetryNotice'
import { useFeedFilter } from '../../store/feedFilter'
import { usePostDetails } from '../../hooks/usePostDetails'
import { PostDetailsLayout } from './PostDetailsLayout'
import { PostDetailsSkeleton } from '../../components/LoadingSkeletons/PostDetailsSkeleton'

interface PostArticleProps {
  post: Post
}

interface PostCommentsProps {
  query: ReturnType<typeof usePostDetails>['comments']
}

/** Renders a post and its comments using the ID from the route. */
export default function PostDetailsPage() {
  const { postId = '' } = useParams()
  const parsedId = postId.trim() === '' ? NaN : Number(postId)
  const details = usePostDetails(parsedId)

  return <PostDetailsLayout>{renderDetails(details)}</PostDetailsLayout>
}

function renderDetails(details: ReturnType<typeof usePostDetails>) {
  const { post: postQuery, comments: commentsQuery, enabled } = details
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
      <PostComments query={commentsQuery} />
    </>
  )
}

function PostArticle({ post }: PostArticleProps) {
  const { id, title, body, userId } = post
  const navigate = useNavigate()
  const showPostsByUser = useFeedFilter((state) => state.showPostsByUser)

  return (
    <article className={classNames(postCardStyles.card, styles.card)}>
      <div className={postCardStyles.heading}>
        <h1>{title}</h1>
        <FavoriteButton postId={id} title={title} />
      </div>
      <p className={sharedStyles.postUser}>User {userId}</p>
      <p className={classNames(styles.body, postCardStyles.body)}>{body}</p>
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

function PostComments({ query }: PostCommentsProps) {
  const { data: comments } = query

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
      {renderComments(query)}
    </section>
  )
}

function renderComments(query: ReturnType<typeof usePostDetails>['comments']) {
  const { data: comments, isError, isFetching, refetch } = query
  if (!comments && isError) {
    return (
      <RetryNotice
        message="We couldn’t load comments."
        retry={refetch}
        retrying={isFetching}
      />
    )
  }
  if (!comments) return <CommentListSkeleton />

  return <CommentList comments={comments} />
}
