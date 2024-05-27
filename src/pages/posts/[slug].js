import { Helmet } from 'react-helmet';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

import { getPostBySlug, getRecentPosts, getRelatedPosts } from 'lib/posts';
import { categoryPathBySlug } from 'lib/categories';
import { formatDate } from 'lib/datetime';
import { ArticleJsonLd } from 'lib/json-ld';
import { helmetSettingsFromMetadata } from 'lib/site';
import useSite from 'hooks/use-site';
import usePageMetadata from 'hooks/use-page-metadata';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';
import Container from 'components/Container';
import Content from 'components/Content';

import styles from 'styles/pages/Post.module.scss';
import Player from 'components/Player';
import PostCard from 'components/PostCard';
import SectionTitle from 'components/SectionTitle';
import CommentForm from 'components/CommentForm';
import ReactStars from 'react-rating-stars-component';
import { MUTATION_CREATE_RATING } from 'data/create-rating';
import { useMutation } from '@apollo/client';
import { useState, useEffect } from 'react';

export default function Post({ post, socialImage, related }) {
  const {
    title,
    metaTitle,
    description,
    content,
    modified,
    featuredImage,
    csOptionsPost
  } = post;

  const { metadata: siteMetadata = {}, homepage } = useSite();

  if (!post.og) {
    post.og = {};
  }

  post.og.imageUrl = `${homepage}${socialImage}`;
  post.og.imageSecureUrl = post.og.imageUrl;
  post.og.imageWidth = 2000;
  post.og.imageHeight = 1000;

  const { metadata } = usePageMetadata({
    metadata: {
      ...post,
      title: metaTitle,
      description: description || post.og?.description || `Read more about ${title}`,
    },
  });

  if (process.env.WORDPRESS_PLUGIN_SEO !== true) {
    metadata.title = `${title} - ${siteMetadata.title}`;
    metadata.og.title = metadata.title;
    metadata.twitter.title = metadata.title;
  }

  const { posts: relatedPostsList } = related || {};

  const helmetSettings = helmetSettingsFromMetadata(metadata);


  /**
   * Rating
   */
  const [starsKey, setStarsKey] = useState(Math.random());
  const [canVote, setCanVote] = useState(false);

  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);

  const [createRating, {data}] = useMutation(MUTATION_CREATE_RATING);

  useEffect(() => {
    
    const test = (localStorage.getItem('canVote' + post.databaseId) !== 'false');
    setTotal(post.rating.total);
    setCount(post.rating.count);
    setCanVote(test);
    setStarsKey(Math.random());

    if (data) {
      setTotal(data.createRating.rating.total);
      setCount(data.createRating.rating.count);
      setCanVote(false);
      localStorage.setItem('canVote' + post.databaseId, 'false');
      setStarsKey(Math.random());
    }

  }, [data, canVote]);

   /**
   * Handle the comment form submission.
   */
   async function handleRating(newVote) {
  
    // Create the comment and await the status.
    await createRating({ 
      variables: { 
        vote: newVote,
        postID: post.databaseId,
      }
   });
  }

  return (
    <Layout>
      <Helmet {...helmetSettings} />

      <ArticleJsonLd post={post} siteTitle={siteMetadata.title} />

      <Container>
        <Section>
          <Header image={featuredImage}>
            <h1
              className={styles.title}
              dangerouslySetInnerHTML={{
                __html: title,
              }}
            />
            <ReactStars
              key={starsKey} 
              count={5}
              value={(count > 0 && total > 0) ? (total / count) : 0}
              size={32}
              color={'rgb(255 255 255 / 50%)'}
              activeColor={'#faa71b'}
              onChange={handleRating}
              edit={canVote}
              emptyIcon={<FaStar/>}
              halfIcon={<FaStarHalfAlt/>}
              filledIcon={<FaStar/>}
            />
          </Header>
        </Section>
        
        <Section>
          <Content>
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{
                __html: csOptionsPost.shortDescription,
              }}
            />
          </Content>
        </Section>

        <Section>
          <Player
            options={csOptionsPost}
          >
          </Player>
        </Section>

        <Section className={styles.postFooter}>
          <SectionTitle>Related posts</SectionTitle>
          {Array.isArray(relatedPostsList) && relatedPostsList.length > 0 && (
            <ul className={styles.relatedPosts}>
              {relatedPostsList.map((post) => (
                <li key={post.slug}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
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

        <p className={styles.postModified}>Last updated on {formatDate(modified)}.</p>

        <Section>
          <div className="columns columns--side-right">
            <CommentForm postID={post.databaseId} />

            <div className="promo">
              Promo
            </div>
          </div>
        </Section>

        
      </Container>

    </Layout>
  );
}

export async function getStaticProps({ params = {} } = {}) {
    const { post } = await getPostBySlug(params?.slug);

  if (!post) {
    return {
      props: {},
      notFound: true,
    };
  }

  const { categories, databaseId: postId } = post;

  const props = {
    post,
    socialImage: `${process.env.OG_IMAGE_DIRECTORY}/${params?.slug}.png`,
  };

  const { category: relatedCategory, posts: relatedPosts } = (await getRelatedPosts(categories, postId)) || {};
  const hasRelated = relatedCategory && Array.isArray(relatedPosts) && relatedPosts.length;

  if (hasRelated) {
    props.related = {
      posts: relatedPosts,
      title: {
        name: relatedCategory.name || null,
        link: categoryPathBySlug(relatedCategory.slug),
      },
    };
  }

  return {
    props,
  };
}

export async function getStaticPaths() {
  // Only render the most recent posts to avoid spending unecessary time
  // querying every single post from WordPress

  // Tip: this can be customized to use data or analytitcs to determine the
  // most popular posts and render those instead

  const { posts } = await getRecentPosts({
    count: process.env.POSTS_PRERENDER_COUNT, // Update this value in next.config.js!
    queryIncludes: 'index',
  });

  const paths = posts
    .filter(({ slug }) => typeof slug === 'string')
    .map(({ slug }) => ({
      params: {
        slug,
      },
    }));

  return {
    paths,
    fallback: false,
    // fallback: 'blocking',
  };
}
