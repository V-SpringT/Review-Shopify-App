import { useEffect, useState } from "react";
import { Form, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  DataTable,
  Pagination,
  Text,
  Thumbnail
} from "@shopify/polaris";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { getAllMetaField } from "../utils/AdminMetafield.server";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const {admin} = await authenticate.admin(request);
  const data = await getAllMetaField(admin)
  // console.log("DU LIEU", data.data.products.edges)
  console.log("DU LIEU  2", data.data.products.edges[12]?.node.images.edges[0].node.originalSrc)
  console.log("DU LIEU 3", JSON.parse(data.data.products.edges[11]?.node.metafields.edges[0].node.value))


  const products = data.data.products.edges

  // get rating
//   const ratings = await getAllRatingApp();
//   const avgRatings = await getAllAvgRating();
//   return { ratings, avgRatings };
  // const ratings = []
  // const avgRatings = {}
  // return { ratings, avgRatings}


  return {products};
};

export default function Index() {
  const rowsPerPage = 5;
  const { products}: any = useLoaderData(); 

  const [pageLeft, setPageLeft] = useState(1);
  // // const [pageRight, setPageRight] = useState(1);

  const [tableData1, setTableData1] = useState<any[]>([]);
  // // const [tableData2, setTableData2] = useState<any[]>([]);


  useEffect(() => {
    const pagination = () => {
      const leftTableData: any[] = [];
      // const rightTableData: any[] = [];
      // Populate left table
      products.forEach((product: any, idx: number) => {
        const images = product?.node.images.edges[0]?.node.originalSrc
        const review = JSON.parse(product?.node.metafields.edges[0]?.node.value ? product?.node.metafields.edges[0]?.node.value : `{}`)
        if(review?.average_rating){
          leftTableData.push([
            idx + 1,
            product.shop,
            // eslint-disable-next-line react/jsx-key
            <Thumbnail source={images} alt="Ảnh đang lỗi" />,
            review?.average_rating ? review.average_rating : 'chua ton tai',
            review?.total_reviews ? review.total_reviews : 'chua ton tai',
            <Form method="post" key={`${review.review?.customerId}`} action={`/app/delete/${product.id}/${review.reviews?.customerId}`}>
            <button
              type="submit"
              name="_method"
              value="delete"
              onClick={() =>
                confirm("Are you sure you want to delete this record?")
              }
            >
              Xóa
            </button>
          </Form>
          ]);
        }
      });

     
      // Handle pagination for left table
      const leftStartIndex = (pageLeft - 1) * rowsPerPage;
      const leftEndIdx = Math.min(leftStartIndex + rowsPerPage, leftTableData.length);
      setTableData1(leftTableData.slice(leftStartIndex, leftEndIdx));
    }; 

    pagination();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageLeft,products]); 

  return (
    <Page fullWidth>
    <Layout>
      <Layout.Section>
        <Card>
          <Text variant="headingLg" as="h2">Bảng 1: Thông tin đánh giá sản phẩm</Text>
          <DataTable
            columnContentTypes={['numeric', 'text', 'text', 'numeric', 'numeric', 'text']}
            headings={['STT', 'Product', 'Images', 'Avg Rating', 'Review Total', '']}
            rows={tableData1}
          />
          <Pagination
            hasPrevious={pageLeft > 1}
            onPrevious={() => setPageLeft(pageLeft - 1)}
            hasNext={products.length > pageLeft * rowsPerPage}
            onNext={() => setPageLeft(pageLeft + 1)}
          />
        </Card>
      </Layout.Section>

     </Layout>
   </Page> 
  );
}

 