window.onload = function () {
	let account={
		name:localStorage.getItem('name_user'),
		phone:localStorage.getItem('phone_user'),
		typeUser:localStorage.getItem('type_user'),
		address:localStorage.getItem('address_user'),

	}

	if(account!=null) {
		$('#name-login').html(account.name);
		$('#name-login1').html(account.name);
		$("#address-delivery").html(account.address);
		$("#phone-delivery").html(account.phone);
		$("#name-delivery").html(account.name);
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
	//ADMIN
	if (location.pathname.includes("products.html")) {
		getAllProductsAdmin();
	}
	if (location.pathname.includes("edit-product.html")) {
		let id = getIdDetails().id;
		showDetailEditProduct(id);
	}
	if (location.pathname.includes("cartProduct.html")) {
		getCartProduct();
	}
	
};

//USER
//Login page -------------------------------------------------------------------\

$("#login_form").submit((e) => {
	e.preventDefault();
	let user = {
		username: $("#username").val(),
		password: $("#password").val(),
	};
	$.ajax({
		type: "POST",
		url: "https://localhost:7244/account/login",
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
					localStorage.setItem('address_user',res.user.address)
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
		url: "https://localhost:7244/account/register",
		data: JSON.stringify(user_register),
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
		url: "https://localhost:7244/product/search/",
		data: { key: typeProduct },
		cache: false,
		success: function (res) {
			if (res.code == 0) {
				ShowProduct(res.products, typeProduct);
			}
		},
	});
}
//show shoe product
function ShowProduct(products, typeProduct) {
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
							<a href="./product/detailProduct.html?id=${product.id
				}" class="container__product-name">${product.productName}</a>
						</div>
						<span class="container__product--price-sale">5.000.000₫</span>
						<span class="container__product--main-price">${changTextPrice(
					product.price
				)}₫</span>
					</div>
					<div class="container__product--hot">Hot</div>
					<div class="container__product--percent">${product.discount}%</div>
				</div>
			</div>
			`;
			if (typeProduct == "shoes") {
				$("#product_shoe").append(html);
			} else if (typeProduct == "clothes") {
				$("#product_clothes").append(html);
			} else if (typeProduct == "jewels") {
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
		url: "https://localhost:7244/product/search/",
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
						<a href="#" class="collection__item-shoes-name">${productDetails.productName
			}</a>
						<p class="collection__item-desc">
							${productDetails.subtitle}
						</p>
						
						<h3 class="collection__item--price-sale">${changTextPrice(
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
					url: "https://localhost:7244/product/addCart/",
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
		url: "https://localhost:7244/product/search/",
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
							<a href="detailProduct.html?id=${product.id}" class="container__product-name">${product.productName
				}</a>
							<span style="display: block;" class="container__product--price-sale">${changTextPrice(
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
		url: "https://localhost:7244/product/getall",
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
			
			<td class="tm-product-name"><a href="edit-product.html?id=${product.id}">${product.productName
			}</a></td>
			<td>1,450</td>
			<td>${product.amount}</td>
			<td>${changTextPrice(product.price)}</td>
			<td>
			<a href="#" onclick=" deleteProductAdmin('${product.id
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
		text: "Login Successfully",
		icon: "error",
		buttons: true,
		dangerMode: true,
	}).then((result) => {
		if (result) {
			$.ajax({
				type: "DELETE",
				url: "https://localhost:7244/admin/product/delete?key=" + key,
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
		url: "https://localhost:7244/product/search?key=" + productID,
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
		url: "https://localhost:7244/admin/account/search?key=" + type,
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
		url: "https://localhost:7244/admin/account/search?key=" + id.toString(),
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
				url: "https://localhost:7244/admin/account/delete?key=" + id.toString(),
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
		address:$("#address").val(),
		username: $("#username").val(),
		email: $("#email").val(),
		typeUser: typeUser,
	};
	$.ajax({
		type: "PUT",
		url: "https://localhost:7244/admin/account/update?UserId=" + id,
		data: JSON.stringify(user_update),
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
		url: "https://localhost:7244/product/getcartproduct?UserId=" + user,
		catch: false,
		success: function (res) {
			if (res.code == 0 && res.count > 0) {
				$("#select-all_cart-product").html(`Tất cả ${res.count} sản phẩm`);
				$("#list_cartProduct-item").html('');
				showListCartProduct(res.listcartProduct);
				caculatePrice(res.listcartProduct);
			}
			else if(res.count==0){
				let html =`
				<div class="cartProduct-noitem">
					<div>
						<div class="no_item-cart-product">
						<span>Giỏ hàng trống</span> 
						</div>
					</div>
				</div>
				`
				$("#list_cartProduct-item").append(html);
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
					<a href="#"><img
							class="container__product-img "
							src="${product.imgLink}"
							alt=""></a>
				</div>
				<div class="product-name">
					<a href="#">
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
				<span id="delete-item_${cartProduct.id
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
					url: "https://localhost:7244/product/updatecartproduct",
					data: JSON.stringify(cart_Product),
					dataType: "json",
					contentType: "application/json",
					cache: false,
					success: function (res) {
						if (res.code == 0) {
							$(`#sumary-price_${product.id}`).html(
								sumaryPrice($(`#amount-${product.id}`).val(), product.price)
								
							);
							getCartProduct()
							
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
				url: "https://localhost:7244/product/updatecartproduct",
				data: JSON.stringify(cart_Product),
				dataType: "json",
				contentType: "application/json",
				cache: false,
				success: function (res) {
					if (res.code == 0) {
						$(`#sumary-price_${product.id}`).html(
							sumaryPrice($(`#amount-${product.id}`).val(), product.price)
						);
						getCartProduct()
						
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
						url: "https://localhost:7244/product/delete?id=" + cartProduct.id,
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
}
function changTextPrice(price) {
	var moneyFormatter = new Intl.NumberFormat();
	return moneyFormatter.format(price);
}
function sumaryPrice(amount, price) {
	let sum = Number.parseInt(amount) * Number.parseInt(price);
	return changTextPrice(sum);
}

function caculatePrice(productCarts) {
	let sumtmp=0;
	let discount=0;
	let summary = 0;
	productCarts.forEach(function(productCart) {
		sumtmp += Number.parseInt(productCart.amount) * Number.parseInt(productCart.product.price);
		discount += Number.parseInt(productCart.amount) * Number.parseInt(productCart.product.price)*
		(Number.parseInt(productCart.product.discount)*0.01)
	})
	summary = sumtmp - discount;
	$("#price-tmp").html(changTextPrice(sumtmp));
	$("#discount-price").html("- "+changTextPrice(discount));
	$("#total-price").html(changTextPrice(summary));

}
