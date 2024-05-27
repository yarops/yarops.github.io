import styles from './CommentForm.module.scss';
import { useMutation } from "@apollo/client";
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
import SectionTitle from 'components/SectionTitle';
if (process.env.NODE_ENV !== 'production') {
  loadErrorMessages();
  loadDevMessages();
}

import { MUTATION_CREATE_COMMENT } from 'data/create-comment';

import {useState} from 'react'

/**
 * The comment form component.
 */
const CommentForm = ({postID}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState('')

  const [createComment, {data, loading, error}] = useMutation(MUTATION_CREATE_COMMENT, {
    variables: {
      name: name,
      email: email,
      comment: comment,
      postID: postID,
    }
  });

  /**
   * Handle the comment form submission.
   */
  async function handleSubmit(e) {
    e.preventDefault()

    // Create the comment and await the status.
    await createComment({
      name,
      email,
      comment,
      postID
    })

    // If the comment was created successfully...
    if (data) {
      // Clear the form.
      setName('')
      setEmail('')
      setComment('')

      // Set the status message.
      setStatus(
        `Thank you ${name}! Your comment has been submitted and is awaiting moderation.`
      )
    }
  }

  return (
    <div className={styles.commentForm}>
      <SectionTitle className={`${styles.sectionTitle} ${styles.commentFormTitle}`}>Leave a Comment</SectionTitle>
      <form className={styles.commentFormInner} onSubmit={handleSubmit}>
        <div className={styles.commentFormRow}>
          <label htmlFor="name">Name*</label>
          <input
            id="name"
            onChange={(e) => setName(e.target.value)}
            required
            type="text"
            value={name}
            className="input"
          />
        </div>
        <div className={styles.commentFormRow}>
          <label htmlFor="email">Email*</label>
          <input
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
            required
            type="email"
            value={email}
            className="input"
          />
        </div>
        <div className={`${styles.commentFormRow} ${styles.commentFormRowMessage}`}>
          <label htmlFor="comment">Comment*</label>
          <textarea
            id="comment"
            onChange={(e) => setComment(e.target.value)}
            required
            value={comment}
            className="textarea"
          ></textarea>
        </div>
        <div className={`${styles.commentFormRow} ${styles.commentFormRowMessage}`}>
          <label htmlFor="comment-accept" className={styles.commentFormAccept}>
            <input type="checkbox" className="form-check-input" id="comment-accept" />
            Save my name, email, and website in this browser for the next time I comment.
            </label>
          <button type="submit" className="{`${styles.commentFormRowButton}`} btn btn--primary">Submit</button>
          <div className={styles.commentFormResult}>
            {loading && (
              <p>Submitting...</p>
            )}
            {error && (
              <p>{error.message}</p>
            )}
            {status && (
              <p>{status}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default CommentForm;