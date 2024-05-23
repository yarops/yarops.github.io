import Link from 'next/link';

import { postPathBySlug } from 'lib/posts';

import FeaturedImage from 'components/FeaturedImage';
import PostCategories from 'components/PostCategories';

import styles from './PostCardVertical.module.scss';

const PostCardVertical = ({ post, options = {} }) => {
  const { title, slug, date, author, categories, featuredImage = false } = post;
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

  return (
    <div className={styles.postCardVertical}>
      <div className={styles.postCardVerticalInner}>
        {featuredImage && (
          <FeaturedImage
            {...featuredImage}
            className={styles.postCardVerticalThumb}
            src={featuredImage.sourceUrl}
            dangerouslySetInnerHTML={featuredImage.caption}
            width="230px"
            height="160px"
            srcSet=""
          />
        )}
        <div className={styles.postCardVerticalContent}>
          <Link href={postPathBySlug(slug)}>
            <h3
              className={styles.postCardVerticalTitle}
              dangerouslySetInnerHTML={{
                __html: title,
              }}
            />
          </Link>
          <PostCategories className={styles.postCardMetadata} {...metadata} />
          <Link className={styles.postCardVerticalButton} href={postPathBySlug(slug)}>
            Play
            <svg className="icon" width="18px" height="18px">
              <use href="#icon-play"></use>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCardVertical;
