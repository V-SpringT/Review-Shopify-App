import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { cors } from "remix-utils/cors";
import { authenticate } from "../shopify.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticate.public.appProxy(request);

  const url = new URL(request.url);
  const CustomerId = String(url.searchParams.get("customerId"));
  const shop = String(url.searchParams.get("shop"));
  const productId = String(url.searchParams.get("productId"));

  console.log(CustomerId)
  if (!CustomerId || !shop || !productId) {
    return json({
      message: "Missing data. Required data: customerId, productId, shop",
      method: request.method,
    });
  }
  
  const response = json({ ok: true, message: "Success"});
  

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
        "Missing data. Required data: customerId, productId, shop, _action",
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
