
export const getAllMetaField = async (admin: any)=>{
    const query = `{
        products(first: 50) {
        edges {
            node {
            id
            title
            images(first: 1) {
                edges {
                node {
                    originalSrc
                }
                }
            }
            metafields(namespace: "reviews", first: 1) {
                edges {
                node {
                    id
                    namespace
                    key
                    value
                    type
                }
                }
            }
            }
        }
        }
    }
    `;

    const response = await admin!.graphql(query)

    return await response.json()

}   