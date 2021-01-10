import Layout from '../../components/Layout';
//import { useRouter } from 'next/router';
import client from '../../components/ApolloClient';
import AddToCartButton from '../../components/cart/AddToCartButton';
import { PRODUCT_BY_SLUG_QUERY, PRODUCT_SLUGS } from '../../queries/product-by-slug';
import clientConfig from '../../client-config';
import { isEmpty } from 'lodash';
import Product from '../../components/Product';

const SingleProduct = ({ product }) => {
  const { name, image, description } = product;

  //const router = useRouter()
  //const { slug } = router.query
  // console.log(slug)  /* check the slug */

  return (
    <Layout>
      {product ? (
        <div className="woo-next-single">
          <div className="woo-next-single__product card bg-light mb-3 p-5">
            <div className="card-header">{name}</div>
            <div className="card-body">
              <h4 className="card-title">{name}</h4>
              {!isEmpty(image) ? (
                <img src={image.sourceUrl} alt="Product Image" width="200" srcSet={image.srcSet} />
              ) : !isEmpty(clientConfig.singleImagePlaceholder) ? (
                <img src={clientConfig.singleImagePlaceholder} alt="Placeholder product image" />
              ) : null}
              <div
                dangerouslySetInnerHTML={{ __html: description }}
                className="card-text"
              />

              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </Layout>
  );
};

export async function getStaticProps({ params: { slug } }) {
  const { data } = await client.query({
    query: PRODUCT_BY_SLUG_QUERY,
    variables: { slug }
  });

  return {
    props: {
      product: data?.product || {}
    },
    revalidate: 1
  };
}

export async function getStaticPaths() {
  const { data } = await client.query({
    query: PRODUCT_SLUGS
  });

  const pathsData = [];

  data?.products?.nodes &&
    data?.products?.nodes.map((product) => {
      if (!isEmpty(product?.slug)) {
        pathsData.push({ params: { slug: product?.slug } });
      }
    });

  return {
    paths: pathsData,
    fallback: false
  };
}

export default SingleProduct;