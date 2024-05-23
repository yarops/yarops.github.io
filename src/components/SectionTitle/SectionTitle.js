import styles from './SectionTitle.module.scss';

const SectionTitle = ({ children }) => {
  return (
    <div
      className={styles.sectionTitleWrapper}
    >
      <h2 className={styles.sectionTitle}>{children}</h2>
    </div>
  );
};

export default SectionTitle;
