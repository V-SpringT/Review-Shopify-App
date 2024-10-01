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

  const updateDom = (avg)=>{
    const avgDiv = document.getElementById("avg");
    const totalDiv = document.getElementById("total");
    avgDiv.innerText = avg.avgStar
    totalDiv.innerText = avg.reviewTotal

    const stars = document.querySelectorAll(".star")
      stars.forEach(s => s.classList.remove('filled'));
      stars.forEach((star,idx)=>{
        if(idx<avg.starValue) star.classList.add("filled") 
      })
  }
  
  
  document.addEventListener('DOMContentLoaded', function () {
    const Rating = {
        appUrl: "/apps/product-rating",
        init: function() {
          fetch(this.appUrl + `/${productId}`)
            .then(response => response.json())
            .then(result => {
              console.log("result", result);
              // const avg = result.data.avgRating
              // updateDom(avg)
            })
            .catch(error => console.log("error", error));
        },
        review: function(ratingValue){
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

    }
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
      Rating.review(ratingValue)
      
    })
  
  }
  });

