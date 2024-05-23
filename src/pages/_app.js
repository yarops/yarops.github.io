import NextApp from 'next/app';

import { SiteContext, useSiteContext } from 'hooks/use-site';
import { SearchProvider } from 'hooks/use-search';

import { getSiteMetadata } from 'lib/site';
import { getRecentPosts } from 'lib/posts';
import { getSidePosts } from 'lib/posts';
import { getCategories } from 'lib/categories';
import NextNProgress from 'nextjs-progressbar';
import { getAllMenus } from 'lib/menus';

import 'styles/globals.scss';
import 'styles/wordpress.scss';
import variables from 'styles/_variables.module.scss';
import { useState } from 'react';

function App({ Component, pageProps = {}, metadata, recentPosts, categories, menus, sidePosts }) {
  const [isNavOpen, setisNavOpen] = useState();

  function toggleNav() { 
    setisNavOpen(!isNavOpen);
  }

  const site = useSiteContext({
    metadata,
    recentPosts,
    categories,
    menus,
    sidePosts,
    isNavOpen,
    setisNavOpen,
    toggleNav,
  });

  return (
    <SiteContext.Provider value={site}>
      <SearchProvider>
        <NextNProgress height={4} color={variables.progressbarColor} />
        <Component {...pageProps} />
      </SearchProvider>
    </SiteContext.Provider>
  );
}

App.getInitialProps = async function (appContext) {
  const appProps = await NextApp.getInitialProps(appContext);

  const { posts: recentPosts } = await getRecentPosts({
    count: 5,
    queryIncludes: 'archive',
  });

  const {sidePosts} = await getSidePosts();

  const { categories } = await getCategories({
    count: 5,
  });

  const { menus = [] } = await getAllMenus();

  return {
    ...appProps,
    metadata: await getSiteMetadata(),
    recentPosts,
    categories,
    menus,
    sidePosts,
    isNavOpen: false,
  };
};

export default App;
