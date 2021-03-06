// alert("Home");
(function () {
  var parent = document.querySelector(".price-slider"); //acts as parent and holds a node list for everything in the HTML <div>
  if (!parent) return;

  var //variables associated with the parent variable that return node list of elements with matching selector
    ranges = parent.querySelectorAll("input[type=range]"),
    numbers = parent.querySelectorAll("input[type=number]");

  //function that associates the range sliders with the input boxes
  ranges.forEach(function (slide) {
    slide.oninput = function () {
      var slide1 = parseFloat(ranges[0].value),
        slide2 = parseFloat(ranges[1].value);

      if (slide1 > slide2) {
        [slide1, slide2] = [slide2, slide1];
      }

      numbers[0].value = slide1;
      numbers[1].value = slide2;
    };
  });

  //function that associates the input boxes with the range sliders
  numbers.forEach(function (input) {
    input.oninput = function () {
      var number1 = parseFloat(numbers[0].value),
        number2 = parseFloat(numbers[1].value);

      ranges[0].value = number1;
      ranges[1].value = number2;
    };
  });
})();

//Connection to the BackEnd
function findImages(images) {
  var image = "";
  if (images.length == 0) {
    return image;
  }
  for (i = 0; i < images.length; i++) {
    if (images[i].is_primary == "true") {
      image = lease.image[i].image;
      return image;
    }
  }
  image = images[0].image;
  return image;
}

async function findLease() {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.onload = function () {
      resolve(this.response);
    };
    xhr.onerror = reject;
    xhr.open("GET", "http://localhost:8000/api/sublet/");
    xhr.send();
  });
}

async function renderLease() {
  let leases = await findLease();
  let html = "";
  leases.forEach((lease) => {
    images = lease.images;
    var link = findImages(images);
    var myLease = JSON.stringify(lease);
    let htmlSegment = `<div class="placard-apt-1" onclick='click1(${myLease})'>
                              <div class="placard-header clear">
                                  <div class="left">
                                      <div>${lease.room_type} Room in ${lease.housing_type}</div>
                                      <div class="right">${lease.address.street}, ${lease.address.city}, ${lease.address.state}, ${lease.address.zipcode}</div>
                                      <div class="clear2">$${lease.cost_per_month}/month</div>
                                  </div>
                              </div>
                              <div class="placard-photo-1 left"><img src="${link}" onerror="this.src='../images/ulease.png'"> </div>
                        </div>`;
    html += htmlSegment;
  });
  let container = document.getElementById("left");
  container.innerHTML = html;
}

function click1(lease) {
  console.log(lease);
  let imageHtml = '';
  let htmlSegment = '';
  if (lease.images.length == 0){
    imageHtml = `<div class="carousel-item active">
                            <img src="../images/ulease.png" class="d-block w-100" alt="../images/ulease.png">
                        </div>`;
  }
  for (var i=0; i<lease.images.length; i++){
    if (i==0){
      htmlSegment = `<div class="carousel-item active">
                            <img src="${lease.images[i].image}" class="d-block w-100" alt="../images/ulease.png">
                        </div>`;
    }
    else{
      htmlSegment = `<div class="carousel-item">
                            <img src="${lease.images[i].image}" class="d-block w-100" alt="../images/ulease.png">
                        </div>`;
    }
    imageHtml += htmlSegment;
  }
  let carousel = document.getElementById("image-carousel");
  carousel.innerHTML = imageHtml;
  let descriptionHtml = `<strong>Lease Description: </strong>${lease.description}`;
  let desHtml = document.getElementById("leaseDescription");
  desHtml.innerHTML = descriptionHtml;
  var header = lease.housing_type +" with " +lease.num_roomates +" Roomate ";
  var leaseAddress = lease.address.street +", " +lease.address.city +", " +lease.address.state +", " +lease.address.zipcode;
  var leaseCost = "$" + lease.cost_per_month + "/month";
  var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
  var start_day = parseInt(lease.start_lease.slice(8,10))
  var start_month = parseInt(lease.start_lease.slice(5,7));
  var start_year = parseInt(lease.start_lease.slice(0,4))
  var end_day = parseInt(lease.end_lease.slice(8,10))
  var end_month = parseInt(lease.end_lease.slice(5,7));
  var end_year = parseInt(lease.end_lease.slice(0,4));
  var start_date = monthNames[start_month] + " " + start_day + ", " + start_year;
  var end_date = monthNames[end_month] + " " + end_day + ", " + end_year;
  var totalDate = start_date + " to " + end_date;
  if (lease.men_allowed == true){
    $("#men-gender").css("color", "#0d6efd");
  }
  if (lease.women_allowed == true){
    $("#women-gender").css("color", "#0d6efd");
  }
  if (lease.nb_other_allowed == true){
    $("#nb-gender").css("color", "#0d6efd");
  }
  if (lease.pets_allowed == true){
    $("#leasePet").css("color", "#0d6efd");
  }
  if (lease.washer_dryer == true){
    $("#leaseWasher").css("color", "#0d6efd");
  }
  if (lease.is_furnished == true){
    $("#leaseFurnishe").css("color", "#0d6efd");
  }
  if (lease.pool_available == true){
    $("#leasePool").css("color", "#0d6efd");
  }
  if (lease.free_parking == true){
    $("#leaseParking").css("color", "#0d6efd");
  }
  if (lease.fitness_center == true){
    $("#leaseFitness").css("color", "#0d6efd");
  }
  $("#roomate").html(header);
  $("#leaseAddress").html(leaseAddress);
  $("#leaseCost").html(leaseCost);
  $("#leaseDate").html(totalDate);

}
var myModalEl = document.getElementById('leaseDetails')
myModalEl.addEventListener('hidden.bs.modal', function (event) {
  $('#leaseDetails .gender').css("color", "#cadfff");
  $('#leaseDetails .pets').css("color", "#cadfff");
})
renderLease();

