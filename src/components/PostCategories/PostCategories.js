import Link from 'next/link';

import { categoryPathBySlug } from 'lib/categories';
import ClassName from 'models/classname';

import styles from './PostCategories.module.scss';

const PostCategories = ({ className, categories }) => {
  const metadataClassName = new ClassName(styles.metadata);

  metadataClassName.addIf(className, className);

  return (
    <div className={styles.postCategories}>
      {Array.isArray(categories) && categories[0] && (
          <Link 
            title={categories.map(({ name }) => name).join(', ')}
            href={categoryPathBySlug(categories[0].slug)}
            >
            {categories[0].name}
          </Link>
      )}
    </div>
  );
};

export default PostCategories;
