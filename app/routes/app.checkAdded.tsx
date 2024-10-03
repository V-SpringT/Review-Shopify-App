import {json, type  ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
   
  console.log("HAHAHAHAHAAHAHAHAHAH")
  const { data: themes } = await admin.rest.resources.Theme.all({ session });
  const currentTheme= themes.find((theme) => theme.role === "main");
  const themeId = currentTheme?.id;

  const { data: assets } = await admin.rest.resources.Asset.all({
    session,
    theme_id: themeId,
    asset: { key: "templates/product.json" },
  });

  const value = JSON.parse(assets[0].value!);
  const sections = value?.sections
  const check = (blocks : any)=>{
    return Object.keys(blocks).some((blockKey)=>{
      return blockKey.includes("product_reviews_app")
    })
  }
//   console.log(sections)
  const hasAppBlock = Object.keys(sections).some((sectionKey) => {
    const section = sections[sectionKey];
    return section.type === "apps" && (section.blocks? check(section.blocks) : false); 
  });
  

  return json({hasAppBlock: hasAppBlock});
};