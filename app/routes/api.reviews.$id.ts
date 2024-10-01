import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { cors } from "remix-utils/cors";
import { authenticate } from "../shopify.server";
import { createDefinitionReview, createMetafieldsReview } from "../utils/ClientMetafield";

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
  
  const responseCreateDefinition = await createDefinitionReview(admin)
  const responseCreateMetafield = await createMetafieldsReview({admin,id})
  console.log("Definition Init", responseCreateDefinition, "---", "Metafield Init", responseCreateMetafield)
  const response = json({ ok: true, message: "Success", data: {a: "EHEHEHEH" } });

  return cors(request, response);
}



export async function action({ request }: ActionFunctionArgs) {
  await authenticate.public.appProxy(request)

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const CustomerId = String(data.customerId);
  const productId = String(data.productId);
  const shop = String(data.shop);
  const star = parseInt(String(data.ratingValue))

  if (!CustomerId || !productId || !shop) {
    return json({
      message:
        "Missing data. Required data: product ",
      method: request.method,
    });
  }

  console.log(CustomerId, productId, shop, star)

  


  const response = json({
    message: "Product removed from your wishlist",
    method: request.method,  
  });

  return cors(request, response);

}
