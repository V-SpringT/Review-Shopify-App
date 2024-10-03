import { useEffect, useState } from "react";
import {
  AppProvider,
  Page,
  Card,
  Button,
  Banner,
  Spinner,
} from "@shopify/polaris";

export default function Index() {
  const [hasAppBlock, setHasAppBlock] = useState(false)
  const [tab, setTab]  = useState(true)
  const [loading, setLoading] = useState(true);
  //url
  const template = "product"
  const uuid = "8dda1150-1321-471c-bbdc-269cc2e9093c"
  const handle = "reviews"
  const target = "newAppsSection"
  const shopDomain = "xuthi.myshopify.com"
  const redirectUrl = `https://${shopDomain}/admin/themes/current/editor?template=${template}&addAppBlockId=${uuid}/${handle}&target=${target}`


  useEffect(()=>{
    checkAdded();
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTab(true)
      }
      else{
        setTab(false)
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  },[tab])

  const checkAdded = async ()=>{
    try{
      const response = await fetch("app/checkAdded", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "check" }),
    });
  
    const result = await response.json();
    setHasAppBlock(result.hasAppBlock)
  }
  catch(e){
    console.error("Error fetching data:", e);
  }
  finally{
    setLoading(false)
  }
    
  }


  if (loading) {
    return (
      <AppProvider i18n={{}}>
        <Page title="Trang Chủ">
          <Card>
            <Spinner size="small" />
            <p>Đang tải dữ liệu...</p>
          </Card>
        </Page>
      </AppProvider>
    );
  }
  return (
    <AppProvider i18n={{}}>
      <Page title="Trang Chủ">
        {hasAppBlock && tab? (
          <Card >
            <Banner
              title="Congratulations!"
            >
              <p>The app block has been successfully added to your theme.</p>
            </Banner>
          </Card>
        ) : (
          <Card>
            <a
              href={redirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Button fullWidth>Add block to theme</Button>
            </a>
          </Card>
        )}
      </Page>
    </AppProvider>
  );
}
