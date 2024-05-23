import Link from 'next/link';

import useSite from 'hooks/use-site';
import { postPathBySlug } from 'lib/posts';
import { categoryPathBySlug } from 'lib/categories';

import Section from 'components/Section';
import Container from 'components/Container';

import footerImage from "/public/images/footer.webp";
import styles from './Footer.module.scss';

const Footer = () => {
  const { metadata = {}, recentPosts = [], categories = [] } = useSite();
  const { title, sweetcoreSettings } = metadata;

  const hasRecentPosts = Array.isArray(recentPosts) && recentPosts.length > 0;
  const hasRecentCategories = Array.isArray(categories) && categories.length > 0;
  const hasMenu = hasRecentPosts || hasRecentCategories;

  return (
    <footer className={styles.footer}>
      {hasMenu && (
        <Section className={styles.footerMenu}>
          <Container className={styles.footerContainer}>
            <img 
              src={footerImage.src}
              alt={title}
              className={styles.footerImage}
            />
            <ul className={styles.footerMenuColumns}>
              {hasRecentPosts && (
                <li>
                  <Link className={styles.footerMenuTitle} href="/posts/">
                    <strong>Recent Games</strong>
                  </Link>
                  <ul className={styles.footerMenuItems}>
                    {recentPosts.map((post) => {
                      const { id, slug, title } = post;
                      return (
                        <li key={id}>
                          <Link href={postPathBySlug(slug)}>{title}</Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              )}
              {hasRecentCategories && (
                <li>
                  <Link href="/categories/" className={styles.footerMenuTitle}>
                    <strong>Categories</strong>
                  </Link>
                  <ul className={styles.footerMenuItems}>
                    {categories.map((category) => {
                      const { id, slug, name } = category;
                      return (
                        <li key={id}>
                          <Link href={categoryPathBySlug(slug)}>{name}</Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              )}
              <li>
                <p className={styles.footerMenuTitle}>
                  <strong>About us</strong>
                </p>
                <ul className={styles.footerMenuItems}>
                  <li>
                    <Link href="/privacy-policy/">Privacy policy</Link>
                  </li>
                  <li>
                    <Link href="/terms of use/">Term of use</Link>
                  </li>
                </ul>
              </li>
              <li>
                <p className={styles.footerMenuTitle}>
                  <strong>More</strong>
                </p>
                <ul className={styles.footerMenuItems}>
                  <li>
                    <a href="/feed.xml">RSS</a>
                  </li>
                  <li>
                    <a href="/sitemap.xml">Sitemap</a>
                  </li>
                </ul>
              </li>
            </ul>
          </Container>
        </Section>
      )}

      <Section className={styles.footerLegal}>
        <Container>
          <p>
            &copy; {new Date().getFullYear()} {title} {sweetcoreSettings.footer.copyright}
          </p>
        </Container>
      </Section>
    </footer>
  );
};

export default Footer;
