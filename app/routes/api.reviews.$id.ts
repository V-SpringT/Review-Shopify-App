import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { cors } from "remix-utils/cors";
import { authenticate } from "../shopify.server";
import { createDefinitionReview, createMetafieldsReview, updateMetafieldsReview, getMetafieldReviews, deleteMetafieldsReview } from "../utils/ClientMetafield.server";
import type  {ReviewOfClient} from '../utils/type.server'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const {admin} = await authenticate.public.appProxy(request);
  const {id} = params

  console.log(id)
  if (!id) {
    return json({
      message: "Missing data. Required data: customerId, productId, shop",
      method: request.method,
    });
  }

  const productMetafield = await getMetafieldReviews({admin,id})
  if(!productMetafield.data.product.metafields){
    await createDefinitionReview(admin)
    await createMetafieldsReview({admin,id})
  }


  const currentReviews = JSON.parse(productMetafield.data.product.metafields.edges[0].node.value)
  // console.log(productMetafield.data.product.metafields)


  const response = json({ ok: true, message: "Success", data: {reviews: currentReviews } });
  return cors(request, response);
}



export async function action({ request, params }: ActionFunctionArgs) {
  const { admin } = await authenticate.public.appProxy(request)
  const {id} = params
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const CustomerId = String(data.customerId);
  const shop = String(data.shop);
  const star = parseInt(String(data.ratingValue))
  const comment = String(data.comment)
  const _action = String(data._action)
  if (!CustomerId || !id || !shop) {
    return json({
      message:
        "Missing data. Required data: product",
      method: request.method,
    });
  }
  console.log(CustomerId, id, shop, star, comment, _action)
  if(_action == "update"){
    console.log("HEHEEHEE")
      const review: ReviewOfClient= {
        customerId: CustomerId,
        shop: shop,
        star: star,
        comment: comment
      }
    
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const responseUpdate = await updateMetafieldsReview({admin, id, review})  

  }else if(_action == "delete"){
      console.log("chay vao day", CustomerId)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const responseDelete = await deleteMetafieldsReview({admin,id,CustomerId})
    }
      
    
  
  const response = json({
    message: "Product removed from your wishlist",
    method: request.method,  
  });

  return cors(request, response);
}
