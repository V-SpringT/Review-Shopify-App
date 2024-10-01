import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { cors } from "remix-utils/cors";
import { authenticate } from "../shopify.server";
import { createDefinitionReview, createMetafieldsReview, updateMetafieldsReview, getMetafieldReviews } from "../utils/ClientMetafield.server";
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
  console.log(productMetafield.data.product.metafields)


  const response = json({ ok: true, message: "Success", data: {a: "EHEHEHEH" } });
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

  if (!CustomerId || !id || !shop) {
    return json({
      message:
        "Missing data. Required data: product",
      method: request.method,
    });
  }

  console.log(CustomerId, id, shop, star, comment)

  const review: ReviewOfClient= {
    customerId: CustomerId,
    shop: shop,
    star: star,
    comment: comment
  }

  const responseUpdate = await updateMetafieldsReview({admin, id, review})
  console.log(responseUpdate)
  const response = json({
    message: "Product removed from your wishlist",
    method: request.method,  
  });

  return cors(request, response);

}
