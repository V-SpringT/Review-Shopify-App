import type {ReviewOfClient} from "./type.server"

export const createDefinitionReview = async (admin: any)=>{
  const query = `mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
    metafieldDefinitionCreate(definition: $definition) {
      createdDefinition {
        id
        name
        key
        namespace
        description
      }
      userErrors {
        field
        message
        code
      }
    }
  }`;
  const variables = {
    definition: {
      name: "Product Review Data",
      key: "product_reviews",
      namespace: "reviews",
      description: "Stores product reviews, average rating, and total reviews",
      type: "json",
      ownerType: "PRODUCT",
      access: {
        admin: "PUBLIC_READ",
        storefront: "PUBLIC_READ",
      },
    },
  };
  const responseCreateDefinition = await admin!.graphql(query, {variables} );

  return responseCreateDefinition
}

export const createMetafieldsReview = async ({admin, id}: any)=>{
    const query = `mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          namespace
          key
          value
          type
        }
        userErrors {
          field
          message
          code
        }
      }
    }`;
  
    const variables = {
      metafields: [{
        ownerId: `gid://shopify/Product/${id}`,
        namespace: "reviews",
        key: "product_reviews",
        value: JSON.stringify({
          average_rating: 0,
          total_reviews: 0,
          reviews: []
        }),
        type: "json"
      }]
    };
  
    const response = await admin!.graphql(query, {variables});

    return response
}

export const updateMetafieldsReview = async ({admin, id, review}: any)=>{
  const product = await getMetafieldReviews({admin,id})

  const currentReviews = JSON.parse(product.data.product.metafields.edges[0].node.value)
  
  const updatedReview = currentReviews.reviews.filter((rv : ReviewOfClient)=>rv.customerId != review.customerId)
  updatedReview.push(review)
  currentReviews.reviews = updatedReview
  currentReviews.total_reviews = updatedReview.length

  const sum = currentReviews.reviews.reduce((sum:number,val: ReviewOfClient)=>{
    return sum + val.star
  },0)
  const avg = sum/currentReviews.total_reviews
  currentReviews.average_rating = avg.toFixed(1)
  console.log(currentReviews)

  const query = `mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        namespace
        key
        value
        type
      }
      userErrors {
        field
        message
        code
      }
    }
  }`
  
  const variables = {
    metafields: [{
      ownerId: `gid://shopify/Product/${id}`, 
      namespace: "reviews",
      key: "product_reviews",
      value: JSON.stringify(currentReviews),
      type: "json"
    }]
  };
  
  await admin!.graphql(query, { variables });
  
  return currentReviews
}

export const getMetafieldReviews = async ({admin, id}: any)=>{

  const query = `
  {
    product(id: "gid://shopify/Product/${id}") {
      id
      title
      metafields(namespace: "reviews", first: 1) {
        edges {
          node {
            id
            key
            value
            type
          }
        }
      }
    }
  }
`

  const product = await admin!.graphql(query)

  return await product?.json()
}


export const deleteMetafieldsReview = async ({admin, id, CustomerId}: any) =>{
  const product = await getMetafieldReviews({admin,id})

  const currentReviews = JSON.parse(product.data.product.metafields.edges[0].node.value)
  
  const updatedReview = currentReviews.reviews.filter((rv : ReviewOfClient)=>{
    console.log(rv.customerId, CustomerId)
    return  rv.customerId != CustomerId
  })
  currentReviews.reviews = updatedReview
  currentReviews.total_reviews = updatedReview.length

  const sum = currentReviews.reviews.reduce((sum:number,val: ReviewOfClient)=>{
    return sum + val.star
  },0)
  const avg = currentReviews.total_reviews == 0 ? sum : sum/currentReviews.total_reviews
  currentReviews.average_rating = avg.toFixed(1)
  console.log(currentReviews)

  const query = `mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        id
        namespace
        key
        value
        type
      }
      userErrors {
        field
        message
        code
      }
    }
  }`
  
  const variables = {
    metafields: [{
      ownerId: `gid://shopify/Product/${id}`, 
      namespace: "reviews",
      key: "product_reviews",
      value: JSON.stringify(currentReviews),
      type: "json"
    }]
  };
  
   await admin!.graphql(query, { variables });
  
  return currentReviews
}