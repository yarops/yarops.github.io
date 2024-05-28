import Head from 'next/head';
import { Helmet } from 'react-helmet';
import { getPageByUri } from 'lib/pages';
import { getPaginatedPosts, getTopPosts } from 'lib/posts';
import { WebsiteJsonLd } from 'lib/json-ld';
import { helmetSettingsFromMetadata } from 'lib/site';
import usePageMetadata from 'hooks/use-page-metadata';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';
import Container from 'components/Container';
import Content from 'components/Content';
import PostCardVertical from 'components/PostCardVertical';
import PostCard from 'components/PostCard';
import Pagination from 'components/Pagination';
import homeImage from "/public/images/home.webp";

import styles from 'styles/pages/Home.module.scss';
import SectionTitle from 'components/SectionTitle';

export default function Home({ page, posts, pagination, topPosts }) {
  // const { title, description } = metadata;

  const { 
    title, 
    metaTitle, 
    description, 
    content,
    csOptionsPage
  } = page;

  const { metadata } = usePageMetadata({
    metadata: {
      ...page,
      title: metaTitle,
      description: description || page.og?.description || `Read more about ${title}`,
    },
  });

  const isServer = typeof window === 'undefined' ? true : false;

  const helmetSettings = helmetSettingsFromMetadata(metadata);

  return (
    <Layout>
      {!isServer && (
        <Head>
          <title>{helmetSettings.title}</title>
        </Head> 
      )}

      <Helmet {...helmetSettings} />
      <WebsiteJsonLd siteTitle={title} />

      <Container>
        <Section>
          <Header>
            <h1 className={styles.title}>{title}</h1>
            <a href="#">
              <svg className="icon" width="24px" height="24px">
                <use href="#icon-angle-down"></use>
              </svg>
            </a>
          </Header>
        </Section>

        <Section>
            <ul className={styles.topPosts}>
              {topPosts.map((post) => {
                return (
                  <li key={post.slug}>
                    <PostCardVertical post={post} />
                  </li>
                );
              })}
            </ul>
        </Section>

        <Section>
          <Content>
            <img 
              src={homeImage.src}
              alt={title}
              style={{float: 'right'}}
            />
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{
                __html: csOptionsPage.shortDescription,
              }}
            />
          </Content>
        </Section>

        <Section>
          <SectionTitle>
            All games
          </SectionTitle>
          <ul className={styles.posts}>
            {posts.map((post) => {
              return (
                <li key={post.slug}>
                  <PostCard post={post} />
                </li>
              );
            })}
          </ul>
          {pagination && (
            <Pagination
              addCanonical={false}
              currentPage={pagination?.currentPage}
              pagesCount={pagination?.pagesCount}
              basePath={pagination?.basePath}
            />
          )}
        </Section>

        <Section>
          <Content>
              <div
                className={styles.content}
                dangerouslySetInnerHTML={{
                  __html: content,
                }}
              />
          </Content>
        </Section>

      </Container>
    </Layout>
  );
}

export async function getStaticProps() {
  const { page } = await getPageByUri('homepage');

  if (!page) {
    return {
      props: {},
      notFound: true,
    };
  }

  const { posts, pagination } = await getPaginatedPosts({
    queryIncludes: 'archive',
  });

  const {topPosts} = await getTopPosts();

  return {
    props: {
      page,
      posts,
      pagination: {
        ...pagination,
        basePath: '/posts',
      },
      topPosts,
    },
  };
}
