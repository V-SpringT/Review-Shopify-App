

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

export const updateMetafieldsReview = async ()=>{
  
}


export const deleteMetafieldsReview = async () =>{
    
}