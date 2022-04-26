const api="https://localhost:7244/"
let account = null;
window.onload = function () {
  if (localStorage.getItem("name_user")) {
    account = {
      name: localStorage.getItem("name_user"),
      phone: localStorage.getItem("phone_user"),
      typeUser: localStorage.getItem("type_user"),
      address: localStorage.getItem("address_user"),
      email: localStorage.getItem("email_user")
    };
  }

  if (account != null) {
    $("#name-login").html(account.name);
    $("#name-admin-login").html(`${account.name} <i class="fas fa-angle-down"></i>`);
    $("#name-login1").html(account.name);
    $("#address-delivery").html(account.address);
    $("#phone-delivery").html(account.phone);
    $("#name-delivery").html(account.name);
    $("#phone-number-profile").html(account.phone);
    $("#email-profile").html(account.email);
    $("#address-profile").html(account.address);

    $("#name-edit-profile").val(account.name);
    $("#phone-edit-profile").val(account.phone);
    $("#address-edit-profile").val(account.address);
    $("#email-edit-profile").val(account.email);
    $("#account_main").css("display", "block");
  } else {
    $("#account_main").css("display", "none");
  }
  //index
  if (
    location.pathname.includes("web-fashion/index.html") ||
    location.pathname.includes("web-fashion") ||
    location.pathname.includes("index.html")
  ) {
    loadProduct("shoes");
    loadProduct("clothes");
    loadProduct("jewels");
  }
  //detail product
  if (location.pathname.includes("detailProduct")) {
    loadDetailProduct();
  }
  if (location.pathname.includes("login.html")) {
    if (account != null) {
      if (account.typeUser == 1 || account.typeUser == 0) {
        swal({
          title: "FAIL",
          text: "Bạn đã đăng nhập !",
          icon: "warning",
          dangerMode: true,
        }).then(() => {
          history.back();
        });
      }
    }
  }
  if (location.pathname.includes("register")) {
    if (account != null) {
      swal({
        title: "FAIL",
        text: "Bạn đã đăng nhập !",
        icon: "warning",
        dangerMode: true,
      }).then(() => {
        history.back();
      });
    }
  }
  //ADMIN

  if (location.pathname.includes("admin.html")) {
    if(account != null){
      if (account.typeUser == 1) {
        getAdminListOrder()
      }else{
        swal({
          title: "FAIL",
          text: "Bạn không có quyền truy cập !",
          icon: "warning",
          dangerMode: true,
        }).then(() => {
          history.back();
        });
      }
    }else{
      swal({
        title: "FAIL",
        text: "Bạn không có quyền truy cập !",
        icon: "warning",
        dangerMode: true,
      }).then(() => {
        history.back();
      });
    }
  }
  if (location.pathname.includes("products.html")) {
    if (account != null) {
      if (account.typeUser == 1) {
        getAllProductsAdmin();
      } else {
        swal({
          title: "FAIL",
          text: "Bạn không có quyền truy cập !",
          icon: "warning",
          dangerMode: true,
        }).then(() => {
          history.back();
        });
      }
    } else {
      swal({
        title: "FAIL",
        text: "Bạn không có quyền truy cập !",
        icon: "warning",
        dangerMode: true,
      }).then(() => {
        history.back();
      });
    }
  }
  if (location.pathname.includes("edit-product.html")) {
    if (account != null) {
      if (account.typeUser == 1) {
        let id = getIdDetails().id;
        showDetailEditProduct(id);
      } else {
        swal({
          title: "FAIL",
          text: "Bạn không có quyền truy cập !",
          icon: "warning",
          dangerMode: true,
        }).then(() => {
          history.back();
        });
      }
    } else {
      swal({
        title: "FAIL",
        text: "Bạn không có quyền truy cập !",
        icon: "warning",
        dangerMode: true,
      }).then(() => {
        history.back();
      });
    }
  }
  if (location.pathname.includes("cartProduct.html")) {
    if (account == null) {
      history.back();
    } else {
      getCartProduct();
    }
  }
  if (location.pathname.includes("Order.html")) {
    if (account != null) {
      getOrder();
    } else {
      history.back();
    }
  }
  $("#logout-icon").click(() => {
    localStorage.clear();
    window.location.href = "../account/login.html";
  });
  $("#logout-admin").click(() => {
    localStorage.clear();
    window.location.href = "../account/login.html";
  });
};

//USER
// change password page

$("#change-pass_form").submit((e) => {
  e.preventDefault();
  let changepass = {
    userId: localStorage.getItem('userId'),
    oldPassword: $("#old-password").val(),
    newPassword: $("#new-password").val(),
    new2Password: $("#new-2-password").val(),
  };
  $.ajax({
    type: "PUT",
    url: `${api}account/changepass`,
    data: JSON.stringify(changepass),
    dataType: "json",
    contentType: "application/json",
    success: function (res) {
      if (res.code == 0) {
        swal({
          title: "SUCCESS",
          text: res.message,
          icon: "success",
          buttons: true,
          dangerMode: true,
        }).then((rs) => {
          if(rs){
            localStorage.clear();
            swal({
              title: "SUCCESS",
              text: "Vui lòng đăng nhập lại !",
              icon: "success",
              buttons: true,
              dangerMode: true,
            }).then((rs) => {
              if(rs){
                window.location.href="./login.html"
              }
            });
  
          }
        });
      } else {
        swal({
          title: "FAIL",
          text: res.message,
          icon: "warning",
          dangerMode: true,
        });
      }
    },
  });
});
//Login page -------------------------------------------------------------------\

$("#login_form").submit((e) => {
  e.preventDefault();
  let user = {
    username: $("#username").val(),
    password: $("#password").val(),
  };
  $.ajax({
    type: "POST",
    url: `${api}account/login`,
    data: JSON.stringify(user),
    dataType: "json",
    contentType: "application/json",
    success: function (res) {
      if (res.code == 0) {
        swal({
          title: "SUCCESS",
          text: "Login Successfully",
          icon: "success",
          buttons: true,
          dangerMode: true,
        }).then(() => {
          localStorage.setItem("userId", res.userId);
          localStorage.setItem("name_user", res.user.name);
          localStorage.setItem("phone_user", res.user.phoneNumber);
          localStorage.setItem("type_user", res.user.typeUser);
          localStorage.setItem("address_user", res.user.address);
          localStorage.setItem("email_user", res.user.email);
          localStorage.setItem("username", res.user.username);
          if (res.typeUser == "1") {
            window.location.href = "../admin/admin.html";
          } else if (res.typeUser == "0") {
            window.location.href = "../index.html";
          }
        });
      } else {
        swal({
          title: "FAIL",
          text: res.message,
          icon: "warning",
          dangerMode: true,
        });
      }
    },
  });
});

//register page --------------------------------------------------------------------------------------
$("#register_form").submit((e) => {
  e.preventDefault();
  let user_register = {
    name: $("#name").val(),
    phoneNumber: $("#phonenumber").val(),
    address: $("#address").val(),
    username: $("#username").val(),
    password: $("#password").val(),
    confirmPassword: $("#confirmPassword").val(),
    email: $("#email").val(),
  };
  $.ajax({
    type: "POST",
    url: `${api}account/register`,
    data: JSON.stringify(user_register),
    contentType: "application/json",
    success: function (res) {
      if (res.code == 0) {
        swal({
          title: "SUCCESS",
          text: "Successfully",
          icon: "success",
          buttons: true,
          dangerMode: true,
        }).then(() => {
          window.location.href = "./login.html";
        });
      } else {
        swal({
          title: "FAIL",
          text: res.message,
          icon: "warning",
          dangerMode: true,
        });
      }
    },
  });
});
//-------------------------------------------------------------------------------------------
//Index page ------------------------------------------------------------------------------

function loadProduct(typeProduct) {
  $.ajax({
    type: "GET",
    url: `${api}product/search/`,
    data: { key: typeProduct },
    cache: false,
    success: function (res) {
      if (res.code == 0) {
        ShowProduct(res.products);
      }
    },
  });
}
//show shoe product
function ShowProduct(products) {
  if (products) {
    products.forEach((product) => {
      let html = `
			<div class="col l-2-4 m-4 s-m-mt-16">
				<div class="container__products">
				<a href="./product/detailProduct.html?id=${product.id}">
					<div class="container__product-banner">
					<img class="container__product-img" src="${product.imgLink}" alt="">
						<div class="container__banner">
							<img src="${product.imgLink}" alt="" class="container__banner-img">
						</div>
					</div>
					</a>
					<div class="container__desc">
						<div class="container__product-ultra">
							<a href="./product/detailProduct.html?id=${
                product.id
              }" class="container__product-name">${product.productName}</a>
						</div>
						<span class="container__product--price-sale"> ${caculatePriceAccount(
              product.discount,
              product.price
            )}₫</span>
						<span class="container__product--main-price">${changTextPrice(
              product.price
            )}₫</span>
					</div>
					<div class="container__product--hot">Hot</div>
					<div class="container__product--percent">${product.discount}%</div>
				</div>
			</div>
			`;
      if (product.typeProduct == "shoes") {
        $("#product_shoe").append(html);
      } else if (product.typeProduct == "clothes") {
        $("#product_clothes").append(html);
      } else if (product.typeProduct == "jewels") {
        $("#product_jewels").append(html);
      }
    });
  }
  // <div class="container__product-banner"></div> //main img
  // <div class="container__banner"></div>// img panner hover
  // <div class="container__product--new">New</div> new product
  // <div class="container__product--hot">Hot</div> hot product
  // <div class="container__product--percent">23%</div> discount product
}
//----------------------------------------------------------------------------------------------------------
///detail product page---------------------------------------------------------------------------------

function getIdDetails() {
  var urlParams;
  (window.onpopstate = function () {
    var match,
      pl = /\+/g, // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) {
        return decodeURIComponent(s.replace(pl, " "));
      },
      query = window.location.search.substring(1);

    urlParams = {};
    while ((match = search.exec(query)))
      urlParams[decode(match[1])] = decode(match[2]);
  })();
  return urlParams;
}
function loadDetailProduct() {
  let id = getIdDetails().id;
  $.ajax({
    type: "GET",
    url: `${api}product/search/`,
    data: { key: id },
    cache: false,
    success: function (res) {
      if (res.code == 0) {
        showDetailProduct(res.products[0]);
        getSameProduct(res.products[0].typeProduct);
      }
    },
  });
}
function showDetailProduct(productDetails) {
  if (productDetails) {
    let detail = `
			<div class="collection__content">
				<div class="col l-6 m-12 c-12">
					<div class="collection__item main-effect">
						<img src="${productDetails.imgLink}" alt="">
					</div>
				</div>
				<div class="col l-6 m-12 c-12">
					<div class="collection__item-info">
						<a href="#" class="collection__item-shoes-name">${
              productDetails.productName
            }</a>
						<p class="collection__item-desc">
							${productDetails.subtitle}
						</p>
						
						<h3 class="collection__item--price-sale">${caculatePriceAccount(
              productDetails.discount,
              productDetails.price
            )}₫ </h3>
						<span class="collection__item--main-price">${changTextPrice(
              productDetails.price
            )}</span>₫</span>
						<span class="collection__item--border-bottom"></span>
						<ul class="collection__promotions-list">
							<li class="collection__promotions-item--gift">
								<img class="collection__promotions-item-img" src="../assets/img/icon-img/gift_g.png" alt=""> QUÀ TẶNG
							</li>
							<li class="collection__promotions-item">
								<i class="collection__promotions-item-icon fas fa-check"></i>MIỄN PHÍ <span class="collection__promotions-item--service">giao hàng toàn quốc</span>
							</li>
							<li class="collection__promotions-item">
								<i class="collection__promotions-item-icon fas fa-check"></i>Tặng 1 áo thun <span class="collection__promotions-item--service">thời trang 190k</span>
							</li>
							<li class="collection__promotions-item">
								<i class="collection__promotions-item-icon fas fa-check"></i>Giao ngay <span class="collection__promotions-item--service">2H tại TP Hồ Chí Minh</span>
							</li>
							<li class="collection__promotions-item">
								<i class="collection__promotions-item-icon fas fa-check"></i>Không lấy quà vui lòng liên hệ</li>
						</ul>
						<div class="cart-product-amount">
							<div class="product-amount">
								<span id="minimize-product-add" class="minimize-amount"><img
										src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/decrease.svg"
										alt=""></span>
								<input id="amount-product" type="tel" value="1">
								<span id="summation-product-add" class="summation-amount"><img
										src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/increase.svg"
										alt=""></i></span>
							</div>
						</div>
					</div>
					
					<button id="btn-add_cart" class="btn-add" > Thêm vào giỏ hàng</button> 
				</div>
			</div> 
			
		`;
    let detail_product = `
			<p class="collection__item-detail-desc">
				${productDetails.description}
				<h4 class="collection__item--size-sale"> Size : ${productDetails.size} &nbsp; &nbsp; &nbsp; Discount : ${productDetails.discount} %</h4>
			</p>
		`;
    $("#description_product").append(detail_product);
    $("#detail_product").append(detail);
    $("#minimize-product-add").click(() => {
      let count = Number($("#amount-product").val());
      if (count > 1) {
        $("#amount-product").val(count - 1);
      }
    });
    $("#summation-product-add").click(() => {
      let count = Number($("#amount-product").val());
      $("#amount-product").val(count + 1);
    });
    $("#btn-add_cart").click(() => {
      let user = localStorage.getItem("userId");
      if (user == null) {
        swal({
          title: "Bạn chưa đăng nhập !",
          text: "Bạn có muốn đăng nhập không ?",
          icon: "error",
          buttons: true,
          dangerMode: true,
        }).then((rs) => {
          if (rs) {
            window.location.href = "../account/login.html";
          }
        });
      } else {
        let cartProduct = {
          Product: productDetails,
          UserId: user,
          amount: Number($("#amount-product").val()),
        };
        $.ajax({
          type: "POST",
          url: `${api}product/addCart/`,
          data: JSON.stringify(cartProduct),
          dataType: "json",
          contentType: "application/json",
          cache: false,
          success: function (res) {
            if (res.code == 0) {
              swal({
                title: "Success !",
                text: "Thêm vào giỏ hàng thành công. Xem giỏ hàng ?",
                icon: "success",
                buttons: true,
                dangerMode: true,
              }).then((rs) => {
                if (rs) {
                  window.location.href = "./cartProduct.html";
                }
              });
            } else {
              swal({
                title: "Fail !",
                text: "Đã xãy ra lỗi . " + res.message,
                icon: "error",
                buttons: true,
                dangerMode: true,
              }).then((rs) => {
                if (rs) {
                  location.reload();
                }
              });
            }
          },
        });
      }
    });
  }
}

function getSameProduct(key) {
  $.ajax({
    type: "GET",
    url: `${api}product/search/`,
    data: { key: key },
    cache: false,
    success: function (res) {
      if (res.code == 0) {
        showSameProduct(res.products);
      }
    },
  });
}
function showSameProduct(products) {
  let html = ``;
  if (products) {
    products.forEach(function (product) {
      html += `
			<div class="row no-gutters">
				<div class="collection__suggestions-container">
					<div class="col l-5 m-6">
						<div class="collection-shoes main-effect">
							<img src="${product.imgLink}" alt="">
						</div>
					</div>
					<div class="col l-7 m-6">
						<div class="collection__app-des mt-8">
							<a href="detailProduct.html?id=${product.id}" class="container__product-name">${
        product.productName
      }</a>
							<span style="display: block;" class="container__product--price-sale"> ${caculatePriceAccount(
                product.discount,
                product.price
              )}đ</span>
							<span class="container__product--main-price">${changTextPrice(
                product.price
              )}₫</span>                                               
						</div>
					</div>
				</div>
			</div>    
			
			`;
    });
  }
  $("#same-product").append(html);
}

//----------------------------------------------------------------------------------------

function getAllProductsAdmin() {
  $.ajax({
    type: "GET",
    url: `${api}product/getall`,
    cache: false,
    success: function (res) {
      if (res.code == 0) {
        showListProductAdmin(res.products);
      }
    },
  });
}
function showListProductAdmin(products) {
  products.forEach(function (product) {
    let html = `
			<tr id="row_${product.id}">
			
			<td class="tm-product-name"><a href="edit-product.html?id=${product.id}">${
      product.productName
    }</a></td>
			<td><img class="img-list-product" src="${product.imgLink}"></td>
			<td>${product.amount}</td>
			<td>${changTextPrice(product.price)}</td>
			<td>
			<a href="#" onclick=" deleteProductAdmin('${
        product.id
      }')" class="tm-product-delete-link">
				<i class="far fa-trash-alt tm-product-delete-icon"></i>
			</a>
			</td>
      
		</tr>
		`;
    $("#list-product").append(html);
  });
}
function deleteProductAdmin(productID) {
  var key = productID.toString();
  swal({
    title: "DELETE",
    text: "Delete Successfully",
    icon: "error",
    buttons: true,
    dangerMode: true,
  }).then((result) => {
    if (result) {
      $.ajax({
        type: "DELETE",
        url: `${api}admin/product/delete?key=` + key,
        cache: false,
        contentType: "text/plain",
        success: function (res) {
          if (res.code == 0) {
            swal({
              title: "Success !",
              text: res.message,
              icon: "success",
              buttons: true,
              dangerMode: true,
            }).then(() => {
              location.reload();
            });
          }
        },
      });
    }
  });
}

function showDetailEditProduct(productID) {
  $.ajax({
    type: "GET",
    url: `${api}product/search?key=` + productID,
    cache: false,
    success: function (res) {
      $("#id").val(productID),
        $("#productName").val(res.products[0].productName),
        $("#productId").val(res.products[0].productId),
        $("#price").val(res.products[0].price),
        $("#amount").val(res.products[0].amount),
        $("#discount").val(res.products[0].discount),
        $("#size").val(res.products[0].size),
        $("#description").val(res.products[0].description);
      $("#subtitle").val(res.products[0].subtitle);
      $('select[name="typeProduct"]')
        .find(`option[value=${res.products[0].typeProduct}]`)
        .attr("selected", true);
      let html = `
				<div style="height: auto" class="tm-product-img-dummy mx-auto">
				<img id="imgLink" src="${res.products[0].imgLink}" alt=""/>
				</div>
				<br>
				`;
      $(".upload_review-list").html("");
      $(".upload_review-list").prepend(html);
    },
  });
}

function getTypeAccount(val) {
  var type = val.value;
  $.ajax({
    type: "GET",
    url: `${api}admin/account/search?key=` + type,
    cache: false,
    success: function (res) {
      showListAccountAdmin(res.users);
    },
  });
}
function showListAccountAdmin(accounts) {
  $("#list-user").html("");
  let html;
  accounts.forEach(function (account) {
    html = `
			<tr onclick="showDetailAccount('${account.id}')">
			<th scope="row">
			
			</th>
			<td class="tm-product-name">${account.name}</td>
			<td>${account.email}</td>
		</tr>
		`;

    $("#list-user").append(html);
  });
}
function showDetailAccount(id) {
  $.ajax({
    type: "GET",
    url: `${api}admin/account/search?key=` + id.toString(),
    cache: false,
    success: function (res) {
      let account = res.users[0];
      let typeUser = $("#typeProduct option:selected").val();
      $("#name").val(account.name);
      $("#email").val(account.email);
      $("#username").val(account.username);
      $("#phoneNumber").val(account.phoneNumber);
      $("#address").val(account.address);
      $('select[name="typeUser"]')
        .find(`option[value=${account.typeUser}]`)
        .attr("selected", true);
      $("#deleteAccount").attr("idUser", `${account.id}`);
      $("#update-account").attr("idUser", `${account.id}`);
    },
  });
}
$("#deleteAccount").click((e) => {
  let id = $(e.target).attr("idUser");
  swal({
    title: "Delete account !",
    text: "Delete Account ?",
    icon: "error",
    buttons: true,
    dangerMode: true,
  }).then((result) => {
    if (result) {
      $.ajax({
        type: "DELETE",
        url: `${api}admin/account/delete?key=` + id.toString(),
        cache: false,
        success: function (res) {
          if (res.code == 0) {
            swal({
              title: "Success!",
              text: res.message,
              icon: "success",
              buttons: true,
              dangerMode: true,
            }).then(() => {
              location.reload();
            });
          } else {
            swal({
              title: "FAIL!",
              text: res.message,
              icon: "error",
              buttons: true,
              dangerMode: true,
            }).then(() => {
              location.reload();
            });
          }
        },
      });
    }
  });
});
$("#update-account").submit((e) => {
  let id = $("#update-account").attr("idUser");
  e.preventDefault();
  let typeUser = $("#typeUser option:selected").val();
  let user_update = {
    name: $("#name").val(),
    phoneNumber: $("#phoneNumber").val(),
    address: $("#address").val(),
    username: $("#username").val(),
    email: $("#email").val(),
    typeUser: typeUser,
  };
  $.ajax({
    type: "PUT",
    url: `${api}admin/account/update?UserId=` + id,
    data: JSON.stringify(user_update),
    contentType: "application/json",
    success: function (res) {
      if (res.code == 0) {
        swal({
          title: "SUCCESS",
          text: res.message,
          icon: "success",
          buttons: true,
          dangerMode: true,
        }).then(() => {
          location.reload();
        });
      } else {
        swal({
          title: "FAIL",
          text: res.message,
          icon: "warning",
          dangerMode: true,
        });
      }
    },
  });
});

function getCartProduct() {
  let user = localStorage.getItem("userId");
  $.ajax({
    type: "GET",
    url: `${api}product/getcartproduct?UserId=` + user,
    catch: false,
    success: function (res) {
      if (res.code == 0 && res.count > 0) {
        $("#select-all_cart-product").html(`Tất cả ${res.count} sản phẩm`);
        $("#list_cartProduct-item").html("");
        showListCartProduct(res.listcartProduct);
      } else if (res.count == 0) {
        let html = `
				<div class="cartProduct-noitem">
					<div>
						<div class="no_item-cart-product">
						<span>Giỏ hàng trống</span> 
						</div>
					</div>
				</div>
				`;
        $("#list_cartProduct-item").append(html);
        $("#btn_cartProduct-paid").click(() => {
          swal({
            title: "Fail",
            text: "Cart is empty!",
            icon: "error",
            buttons: true,
          });
        });
      }
    },
  });
}
function showListCartProduct(cartProducts) {
  cartProducts.forEach(function (cartProduct) {
    let product = cartProduct.product;
    let html = `
		<div class="cartProduct_item">
			<div class="cartProduct_item-img">
				<div class="product-img container__product-banner main-effect">
					<a href="detailProduct.html?id=${product.id}"><img
							class="container__product-img "
							src="${product.imgLink}"
							alt=""></a>
				</div>
				<div class="product-name">
					<a href="detailProduct.html?id=${product.id}">
						<h3>${product.productName}</h3>
					</a>
				</div>
			</div>
			<div class="product-price">
				<span>${changTextPrice(product.price)}₫</span>
			</div>
			<div class="cart-product-amount">
				<div class="product-amount">
					<span id="decrease-item_${product.id}" class="minimize-amount"><img
							src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/decrease.svg"
							alt=""></span>
					<input id="amount-${product.id}" type="tel" value="${cartProduct.amount}">
					<span id="increase-item_${product.id}" class="summation-amount"><img
							src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/increase.svg"
							alt=""></i></span>
				</div>
			</div>
			<div class="product-price-total">
				<span id ="sumary-price_${product.id}" >${sumaryPrice(
      cartProduct.amount,
      product.price
    )}</span>
			</div>
			<div class="product-delete">
				<span id="delete-item_${
          cartProduct.id
        }"><i class="fa-solid fa-trash-can"></i></span>
			</div>
		</div>
		`;
    $("#list_cartProduct-item").append(html);
    $(`#decrease-item_${product.id}`).click(() => {
      let count = Number($(`#amount-${product.id}`).val());
      if (count > 1) {
        $(`#amount-${product.id}`).val(count - 1);
        let cart_Product = {
          Product: product,
          UserId: localStorage.getItem("userId"),
          amount: Number($(`#amount-${product.id}`).val()),
        };
        $.ajax({
          type: "PUT",
          url: `${api}product/updatecartproduct`,
          data: JSON.stringify(cart_Product),
          dataType: "json",
          contentType: "application/json",
          cache: false,
          success: function (res) {
            if (res.code == 0) {
              $(`#sumary-price_${product.id}`).html(
                sumaryPrice($(`#amount-${product.id}`).val(), product.price)
              );

              getCartProduct();
            }
          },
        });
      }
    });
    $(`#increase-item_${product.id}`).click(() => {
      let count = Number($(`#amount-${product.id}`).val());
      $(`#amount-${product.id}`).val(count + 1);
      let cart_Product = {
        Product: product,
        UserId: localStorage.getItem("userId"),
        amount: Number($(`#amount-${product.id}`).val()),
      };
      $.ajax({
        type: "PUT",
        url: `${api}product/updatecartproduct`,
        data: JSON.stringify(cart_Product),
        dataType: "json",
        contentType: "application/json",
        cache: false,
        success: function (res) {
          if (res.code == 0) {
            $(`#sumary-price_${product.id}`).html(
              sumaryPrice($(`#amount-${product.id}`).val(), product.price)
            );
            getCartProduct();
          }
        },
      });
    });
    $(`#delete-item_${cartProduct.id}`).click(() => {
      swal({
        title: "DELETE",
        text: "Bạn có chắc muôn xóa ?",
        icon: "error",
        buttons: true,
        dangerMode: true,
      }).then((rs) => {
        if (rs) {
          $.ajax({
            type: "DELETE",
            url: `${api}product/delete?id=` + cartProduct.id,
            cache: false,
            success: function (res) {
              if (res.code == 0) {
                location.reload();
              }
            },
          });
        }
      });
    });
  });
  caculatePrice(cartProducts);
}
///payment click handler
$("#btn_cartProduct-paid").click(() => {
  let sumtmp = 0;
  let discount = 0;
  let summary = 0;
  let productCarts;
  $.ajax({
    type: "GET",
    url:
      `${api}product/getcartproduct?UserId=` +
      localStorage.getItem("userId"),
    catch: false,
    success: function (res) {
      if (res.code == 0 && res.count > 0) {
        productCarts = res.listcartProduct;
        productCarts.forEach(function (Cart) {
          sumtmp +=
            Number.parseInt(Cart.amount) * Number.parseInt(Cart.product.price);
          discount +=
            Number.parseInt(Cart.amount) *
            Number.parseInt(Cart.product.price) *
            (Number.parseInt(Cart.product.discount) * 0.01);
        });
        summary = sumtmp - discount;
        let order = {
          productCart: productCarts,
          totalPrice: summary,
          CusName: localStorage.getItem("name_user"),
        };
        if ($("address-delivery").val() == "") {
          swal({
            title: "Fail",
            text: "Chưa có địa chỉ giao hàng !",
            icon: "error",
            buttons: true,
            dangerMode: true,
          });
        } else {
          $.ajax({
            type: "POST",
            url: `${api}product/payment`,
            data: JSON.stringify(order),
            dataType: "json",
            contentType: "application/json",
            success: function (res) {
              if (res.code == 0) {
                swal({
                  title: "SUCCESS",
                  text: "Payment Successfully",
                  icon: "success",
                  buttons: true,
                  dangerMode: true,
                }).then(() => {
                  $("#list_cartProduct-item").html("");
                  $.ajax({
                    type: "DELETE",
                    url:
                      `${api}product/deleteAll?id=` +
                      localStorage.getItem("userId"),
                    cache: false,
                    success: function (res) {
                      if (res.code == 0) {
                        window.location.href = "./Order.html";
                      }
                    },
                  });
                });
              } else {
                swal({
                  title: "FAIL",
                  text: res.message,
                  icon: "warning",
                  dangerMode: true,
                });
              }
            },
          });
        }
      }
    },
  });
});

function changTextPrice(price) {
  var moneyFormatter = new Intl.NumberFormat();
  return moneyFormatter.format(price);
}
function sumaryPrice(amount, price) {
  let sum = Number.parseInt(amount) * Number.parseInt(price);
  return changTextPrice(sum);
}
function caculatePriceAccount(Discount, price) {
  let sum = (100 - Number.parseInt(Discount)) * 0.01 * price;
  return changTextPrice(sum);
}
function caculatePrice(productCarts) {
  let sumtmp = 0;
  let discount = 0;
  let summary = 0;
  productCarts.forEach(function (Cart) {
    sumtmp +=
      Number.parseInt(Cart.amount) * Number.parseInt(Cart.product.price);
    discount +=
      Number.parseInt(Cart.amount) *
      Number.parseInt(Cart.product.price) *
      (Number.parseInt(Cart.product.discount) * 0.01);
  });
  summary = sumtmp - discount;
  $("#price-tmp").html(changTextPrice(sumtmp));
  $("#discount-price").html("- " + changTextPrice(discount));
  $("#total-price").html(changTextPrice(summary));
}
function getOrder() {
  let userId = localStorage.getItem("userId");
  if (userId == null) {
    let html = `
      <div class="cartProduct-noitem">
          <div>
              <div class="no_item-cart-product">
              <span>Không có đơn hàng nào!</span> 
              </div>
          </div>
      </div>`;
    $("#list-order").append(html);
  } else {
    $.ajax({
      type: "GET",
      url: `${api}product/getorder?userId=` + userId,
      catch: false,
      success: function (res) {
        if (res.code == 0 && res.count > 0) {
          $("#list-order").html("");
          showListOrder(res.listOrder);
        } else if (res.count == 0) {
          $("#list-order").html("");
          let html = `
          <div class="cartProduct-noitem">
              <div>
                  <div class="no_item-cart-product">
                  <span>Không có đơn hàng nào!</span> 
                  </div>
              </div>
          </div>`;
          $("#list-order").append(html);
        } else {
          let html = `
          <div class="cartProduct-noitem">
              <div>
                  <div class="no_item-cart-product">
                  <span>Không có đơn hàng nào!</span> 
                  </div>
              </div>
          </div>`;
          $("#list-order").append(html);
        }
      },
    });
  }
}
function showListOrder(listOrders) {
  listOrders.forEach((listOrder, i) => {
    
    let productCarts = listOrder.productCart;
    let html = `
      <div class="order_heading-container">
          <label>
              <span id="order-status-${i}"></span>
          </label>

          <span></span>
      </div>
      <div id="list-product-order-${i}" class="col l-12 order-list">
          
          <div class="order_footer-container">
          <label>
              <button id="btn-cus-conf-${i}" class="btn-confirm-delivery">Đã nhận hàng</button>
          </label>
              <span><strong>Tổng cộng: &ensp;</strong><span id="total_price-order-${i}"></span></span>
          </div>
      </div>
    `;
    $("#list-order").append(html);
    if(listOrder.cusConfirm==1){
      $(`#btn-cus-conf-${i}`).css("display","none");
    }
    let summaryPrice = 0;
    productCarts.forEach((productCart) => {
      summaryPrice += listOrder.totalPrice;
      let product = productCart.product;
      let html1 = `
      
          <div id="order_detais" class="order_detais">
            <div class="order_item-img">
                <div class="order_item container__product-banner main-effect">
                    <a id="img-item"  href="detailProduct.html?id=${
                      product.id
                    }"><img
                            class="container__product-img "
                            src="${product.imgLink}"
                            alt=""></a>
                </div>
                <div class="product-name">
                    <a  href="detailProduct.html?id=${product.id}">
                        <h3 id="product-item-name">${product.productName}</h3>
                    </a>
                    <div class="product-price ">
                        <span id="product-price-item">${changTextPrice(product.price)}</span>
                    </div>
                    <div class="container__product--percent">${product.discount}%</div>
                </div>
            </div>
            <div class="order-price">
                <span><strong>Số lượng: &ensp;</strong><span id="amount-product-item">${
                  productCart.amount
                }</span></span>
            </div>
            <div class="order-price">
                <span class="price-product-item">${changTextPrice(
                  listOrder.totalPrice
                )}₫</span>
            </div>
          </div>
      `;
      
      $(`#list-product-order-${i}`).prepend(html1);
      $(`#order-status-${i}`).html(listOrder.status);
    });

    $(`#total_price-order-${i}`).html(changTextPrice(summaryPrice));
    $(`#btn-cus-conf-${i}`).click(()=>{
      let updateorder ={
        productCart:productCarts,
        totalPrice:listOrder.totalPrice,
        cusName:listOrder.cusName,
        status:listOrder.status,
        cusConfirm:1,
        adminConfirm:listOrder.adminConfirm,
      }
      $.ajax({
        type: "PUT",
        url: `${api}product/updateOrder?id=${listOrder.id}`,
        data:JSON.stringify(updateorder),
        dataType: "json",
        contentType: "application/json",
        catch: false,
        success: function (res) {
           if(res.code==0){
            swal({
              title: "SUCCESS",
              text:"Xác nhận đã nhận hàng thành công!",
              icon: "success",
              button: "Ok !",
            }).then(()=>{
              $(`#btn-cus-conf-${i}`).css("display","none");
            })
           }
        },
      });
    })
  });
}
function getAdminListOrder(){
  $.ajax({
    type: "GET",
    url: `${api}admin/product/getallOder`,
    catch: false,
    success: function (res) {
        showAdminListOrder(res.listOrder)
    },
  });
}

function  showAdminListOrder(listOrders) {
  listOrders.forEach((listOrder,i) => {
    console.log(listOrder)
    let html = `
    <tr>
        <th scope="row">#<b id="id_${i}">${listOrder.id}</b></th>
        <td><b>${listOrder.cusName}</b></td>
        <td><b>${changTextPrice(listOrder.totalPrice)}₫</b></td>
        <td>1${listOrder.createdOn}</td>
        <td>
            <span id="status-item-list-${i}" class="tm-status-circle">
            </span>
            <p id="name-status-item-list-${i}" class="tm-status-circle">
            </p>
        </td>
        <td>
        <a id="open-modal" href="#"data-toggle="modal" data-target="#myModal"><i class="far fa-edit tm-product-delete-icon"></i></a>   
        </td>
        <td>
            <i id="rm-order-${i}" class="far fa-trash-alt tm-product-delete-icon"></i>
        </td>
    </tr> 
    `
   
    $("#list-admin-order").append(html)
    if(listOrder.adminConfirm==0){
      $(`#status-item-list-${i}`).addClass('cancelled')
      $(`#name-status-item-list-${i}`).html("pending")
    }else if(listOrder.adminConfirm==1){
      $(`#status-item-list-${i}`).addClass('pending')
      $(`#name-status-item-list-${i}`).html("moving")
    }else if(listOrder.adminConfirm==2&&listOrder.cusConfirm==1){
      $(`#status-item-list-${i}`).addClass('moving')
      $(`#name-status-item-list-${i}`).html("success")
    }else{
      $(`#status-item-list-${i}`).addClass('pending')
      $(`#name-status-item-list-${i}`).html("watting")
    }
    $("#open-modal").click(() => {
      $("#modal-order-id").html(`#${listOrder.id}`)
      $("#modal-cus-name").html(listOrder.cusName)
      $("#modal-cus-address").html(localStorage.getItem("address_user"))
      $("#modal-cus-amount").html(listOrder.productCart.length)
      $("#modal-cus-total-price").html(changTextPrice(listOrder.totalPrice)+'đ')
      $("#modal-cus-total-price").attr("price-value",listOrder.totalPrice)
      $(`select option[value=${listOrder.adminConfirm}]`).attr("selected",true);
      $('#modal-update-order').click(()=>{
          let updateorder ={
            productCart:listOrder.productCart,
            totalPrice:listOrder.totalPrice,
            cusName:listOrder.cusName,
            status:$('#modal-status :selected').text(),
            cusConfirm:listOrder.cusConfirm,
            adminConfirm:Number($('#modal-status').val()),
          }
          $.ajax({
            type: "PUT",
            url: `${api}product/updateOrder?id=${listOrder.id}`,
            data:JSON.stringify(updateorder),
            dataType: "json",
            contentType: "application/json",
            catch: false,
            success: function (res) {
              if(res.code==0){
                swal({
                  title: "SUCCESS",
                  text:res.message,
                  icon: "success",
                  button: "Ok !",
                }).then(()=>{
                  location.reload();
                })
              }
            },
          });
        })
    })
    $(`#rm-order-${i}`).click(()=>{
      swal({
        title: "DELETE",
        text:" Bạn có chắc muốn xóa đơn hàng này ?",
        icon: "error",
        
        buttons: true,
        dangerMode: true,
      }).then(rs=>{
        if(rs){
          $.ajax({
            type: "DELETE",
            url: `${api}admin/product/deleteorder?key=`+$(`#id_${i}`).html(),
            catch: false,
            success: function (res) {
              if(res.code==0){
                swal({
                  title: "SUCCESS",
                  text:" Xóa đơn hàng thành công",
                  icon: "success",
                  button: "Ok !",
                }).then(()=>{
                  location.reload();
                })
              }
            },
          });
        }
      })
    })
  })
}
$("#search_btn").click(()=>{
  let search = $("#search_val").val();
  $("#product_shoe").html("")
  $("#product_clothes").html("")
  $("#product_jewels").html("")
  loadProduct(search)
  $('.top-search__overlay').css('display', 'none')
})

$("#btn-save-change-profile").click(()=>{
  let id = localStorage.getItem("userId")
  let user_update = {
    name: $("#name-edit-profile").val(),
    phoneNumber: $("#phone-edit-profile").val(),
    address: $("#address-edit-profile").val(),
    username:localStorage.getItem("username"),
    email: $("#email-edit-profile").val(),
    typeUser: localStorage.getItem("type_user"),
  };
  $.ajax({
    type: "PUT",
    url: `${api}account/update?UserId=` + id,
    data: JSON.stringify(user_update),
    contentType: "application/json",
    success: function (res) {
      if (res.code == 0) {
        swal({
          title: "SUCCESS",
          text: res.message,
          icon: "success",
          button: "OK",
          dangerMode: true,
        }).then(() => {
          swal({
            title: "SUCCESS",
            text:"Bạn cần phải đăng nhập lại!",
            icon: "success",
            button: "OK",
            dangerMode: true,
          }).then(() => {
            localStorage.clear()
            window.location.href="../account/login.html"
          })
        });
      } else {
        swal({
          title: "FAIL",
          text: res.message,
          icon: "warning",
          dangerMode: true,
        });
      }
    },
  });
})