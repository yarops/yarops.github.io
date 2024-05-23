import Link from 'next/link';

import { postPathBySlug } from 'lib/posts';

import FeaturedImage from 'components/FeaturedImage';

import { FaMapPin } from 'react-icons/fa';
import styles from './PostCard.module.scss';

const PostCard = ({ post, options = {} }) => {
  const { title, slug, date, author, categories, featuredImage, isSticky = false } = post;
  const { excludeMetadata = [] } = options;

  const metadata = {};

  if (!excludeMetadata.includes('author')) {
    metadata.author = author;
  }

  if (!excludeMetadata.includes('date')) {
    metadata.date = date;
  }

  if (!excludeMetadata.includes('categories')) {
    metadata.categories = categories;
  }

  let postCardStyle = styles.postCard;

  if (isSticky) {
    postCardStyle = `${postCardStyle} ${styles.postCardSticky}`;
  }

  return (
    <div className={postCardStyle}>
      <div className={styles.postCardInner}>
        {isSticky && <FaMapPin aria-label="Sticky Post" />}
        {featuredImage && (
          <FeaturedImage
            {...featuredImage}
            src={featuredImage.sourceUrl}
            dangerouslySetInnerHTML={featuredImage.caption}
            width="230px"
            height="160px"
            srcSet=""
          />
        )}
        <Link href={postPathBySlug(slug)}>
          <h3
            className={styles.postCardTitle}
            dangerouslySetInnerHTML={{
              __html: title,
            }}
          />
          <span className={styles.postCardArrow}>
            <svg className="icon" width="24px" height="24px">
              <use href="#icon-angle-down"></use>
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
