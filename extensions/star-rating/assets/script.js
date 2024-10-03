/* eslint-disable no-undef */

document.querySelectorAll('.star-rating').forEach(rating => {
  const stars = rating.querySelectorAll('.star');
  
  stars.forEach((star, index) => {
    star.addEventListener('click', () => {
      stars.forEach(s => s.classList.remove('filled'));
      for (let i = 0; i <= index; i++) {
        stars[i].classList.add('filled');
      }
      
      rating.setAttribute('data-rating', index + 1);
    });
  });
});



  const updateDom = (star,cmt,avg, toalRv)=>{

    console.log("may lam sao  ", avg)
    const avgDiv = document.getElementById("avg");
    const totalDiv = document.getElementById("total");
    avgDiv.innerText = avg
    totalDiv.innerText = toalRv
    const cmtDiv = document.getElementById("comment-content")
    cmtDiv.value = cmt
    const stars = document.querySelectorAll(".star")
      stars.forEach(s => s.classList.remove('filled'));
      stars.forEach((st,idx)=>{
        if(idx<star) st.classList.add("filled") 
      })
  }
  
  function renderReviews(reviews) {
    var reviewList = document.querySelector('.review-list');
    
    if (!reviewList || !reviews || Object.keys(reviews).length === 0) {
      reviewList.innerHTML = '<p>Không có đánh giá nào.</p>';
      return;
    }
    reviewList.innerHTML = '';

    for (const key in reviews) {
      if (reviews.hasOwnProperty(key)) {
        const review = reviews[key];
        
        // Tạo HTML cho mỗi review
        const reviewItem = `
          <div class="review-item" id="review-${review.customerId}">
            <div class="review-header">
              <img class="review-avatar" src="${review.avatar}" alt="null's avatar" />
              <h3 class="review-name">${review.customerId}</h3>
            </div>
            <p class="review-comment">${review.comment}</p>
            <button id="delete-rv" class="delete-review" data-review-id="${review.customerId}">Xóa</button>
          </div>
        `;
        
        reviewList.innerHTML += reviewItem;
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const Rating = {
        appUrl: "/apps/product-rating",
        init: function() {
          fetch(this.appUrl + `/${productId}`)
            .then(response => response.json())
            .then(result => {
              console.log("result", result);
              const reviewArr= result.data.reviews.reviews
              const starList = document.getElementById("rating-value")
              if(starList){
                console.log("Gia tri o day ", reviewArr)
                const customerReview = reviewArr.find(rv=>rv.customerId == customerId)
                if(customerReview){
                  console.log(customerReview)
                  updateDom(parseInt(customerReview.star), customerReview.comment,parseFloat( result.data.reviews.average_rating),parseInt(result.data.reviews.total_reviews))
                }
            }
            
            renderReviews(reviewArr)

            const deleteBtn = document.getElementById("delete-rv")
            if(deleteBtn){
              deleteBtn.addEventListener("click",()=>{
                Rating.review(0,"delete")
                location.reload()
              })
              
            }
            })
            .catch(error => console.log("error", error));

            
            
        },
        review: function(ratingValue, action){
          if(!customerId){
            alert("Please login to review product");
            return;
          }
          const formData = new FormData();
          formData.append("customerId", customerId);
          formData.append("shop", shopDomain);
          formData.append("ratingValue", ratingValue);
          const comment = document.getElementById('comment-content')
          formData.append("comment", comment ? comment.value: "")
          formData.append("_action", action)
          const requestOptions = {
            method: 'POST',
            body: formData,
            redirect: 'follow'
          };
          fetch(this.appUrl + `/${productId}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("result", result)
                // updateDom(avg)
            })
            .catch(error => console.log('error', error));

          },
  }
  Rating.init();

  const ratingValueDiv = document.getElementById("rating-value")
  let ratingValue = 0
  
  const ReviewButton = document.getElementById('myButton')
  console.log("button", ReviewButton);
  if(ReviewButton){
    ReviewButton.addEventListener("click",()=>{  
      if(ratingValueDiv){
        ratingValue = ratingValueDiv.getAttribute(["data-rating"])
      }
      Rating.review(ratingValue, "update")
      this.location.reload()
    })
  }



  });

