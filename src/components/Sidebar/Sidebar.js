import styles from './Sidebar.module.scss';
import Link from 'next/link';

import useSite from 'hooks/use-site';
import { findMenuByLocation } from 'lib/menus';
import { postPathBySlug } from 'lib/posts';

import NavListItem from 'components/NavListItem';
import Logo from 'components/Logo';
import Image from 'components/Image';
import { pagePathBySlug } from 'lib/pages';

const Sidebar = ({ ...rest }) => {
  const { menus, sidePosts } = useSite();
  const navigation = findMenuByLocation(menus, "sidemenu");

  return (
    <aside {...rest} className={styles.sidebar}>
      <div className={styles.sidebarBrand}>
        <Link 
          href="/"
        >
          <Logo />
        </Link>
      </div>

      <ul className={styles.sideMenu}>
        {navigation?.map((listItem) => {
          return <NavListItem key={listItem.id} className={styles.navSubMenu} item={listItem} />;
        })}
      </ul>

      <div
        className={styles.sideWidget}
      >
        <Link
          className="btn btn--primary"
          href={pagePathBySlug('contact-us')}
          title="Contact us"
        >
          Contact us
        </Link>
      </div>

      <div
        className={styles.sideWidget}
      >
        <p className={styles.sideWidgetTitle}>Top rated:</p>
        <div className={styles.sidePosts}>
          {sidePosts.map((post) => {
            return (
              <Link href={postPathBySlug(post.slug)} key={post.slug}>
                {post.featuredImage && (
                  <Image
                    src={post.featuredImage.sourceUrl}
                    width="230px"
                    height="230px"
                    alt={post.title}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      <div className={styles.sideWidget}>
        <div className="social-groups">
          <a
            href="#"
            target="_blank"
            className="social-groups__item social-groups__item--github"
            title="Github"
          >
            <span className="social-groups__item-inner">
              <svg className="icon" width="24px" height="24px">
                <use href="#icon-github"></use>
              </svg>
            </span>
          </a>
          <a
            href="#"
            target="_blank"
            className="social-groups__item social-groups__item--youtube"
            title="Youtube channel"
          >
            <span className="social-groups__item-inner">
              <svg className="icon" width="24px" height="24px">
                <use href="#icon-youtube"></use>
              </svg>
            </span>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
