import styles from './Header.module.scss';
import FeaturedImage from 'components/FeaturedImage';

const Header = ({ children, image }) => {
  return (
    <header className={styles.header}>
      {image && (
        <FeaturedImage
          {...image}
          src={image.sourceUrl}
          dangerouslySetInnerHTML={image.caption}
        />
      )}
      <div className={styles.headerInner}>
        {children}
      </div>
    </header>
  );
};

export default Header;
