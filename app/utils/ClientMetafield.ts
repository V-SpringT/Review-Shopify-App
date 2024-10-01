

export const createDefinitionReview = async ()=>{
    await fetch("/admin/api/2024-07/graphql.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": "your-access-token",
        },
        body: JSON.stringify({
          query: `mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
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
          }`,
          variables: {
            definition: {
              name: "Product Review Data",
              key: "product_reviews",
              namespace: "reviews",
              description: "Stores product reviews, average rating, and total reviews",
              type: "json",
              ownerType: "PRODUCT",
              access: {
                admin: "READ_WRITE",
                storefront: "READ",
              },
              validations: [
                {
                  name: "json",
                  type: "json", 
                },
              ],
            },
          },
        }),
      })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch(error => console.error('Error:', error));
      
}

export const createMetafieldsReview = async ()=>{

}

export const updateMetafieldsReview = async ()=>{

}


export const deleteMetafieldsReview = async () =>{
    
}