import { getAllCategories, getCategoryBySlug } from 'lib/categories';
import { getPaginatedPostsByCategoryId } from 'lib/posts';
import usePageMetadata from 'hooks/use-page-metadata';

import TemplateArchive from 'templates/archive';
import Title from 'components/Title';

export default function Category({ category, posts, pagination }) {
  const { name, description, slug, content } = category;

  const { metadata } = usePageMetadata({
    metadata: {
      ...category,
      description: description || category.og?.description || `Read ${posts.length} posts from ${name}`,
    },
  });

  return <TemplateArchive 
    title={name} 
    Title={<Title title={name} />} 
    posts={posts} 
    pagination={pagination}
    slug={slug} 
    content={content} 
    metadata={metadata} 
  />;
}

export async function getStaticProps({ params = {} } = {}) {
  const { category } = await getCategoryBySlug(params?.slug);

  if (!category) {
    return {
      props: {},
      notFound: true,
    };
  }

  const { posts, pagination } = await getPaginatedPostsByCategoryId({
    categoryId: category.databaseId,
    queryIncludes: 'archive',
  });

  return {
    props: {
      category,
      posts,
      pagination: {
        ...pagination,
        basePath: '/c/' + params?.slug,
      },
    },
  };
}

export async function getStaticPaths() {
  // By default, we don't render any Category pages as
  // we're considering them non-critical pages

  // To enable pre-rendering of Category pages:

  // 1. Add import to the top of the file
  //
  // import { getAllCategories, getCategoryBySlug } from 'lib/categories';

  // 2. Uncomment the below
  //
  const { categories } = await getAllCategories();

  const paths = categories.map((category) => {
    const { slug } = category;
    return {
      params: {
        slug,
      },
    };
  });

  // 3. Update `paths` in the return statement below to reference the `paths` constant above

  return {
    paths: paths,
    // fallback: 'blocking',
    fallback: false,
  };
}
