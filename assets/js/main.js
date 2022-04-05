//USER
//Login page -------------------------------------------------------------------
$("#login_form").submit((e) => {
	e.preventDefault();
	let user = {
		username: $("#username").val(),
		password: $("#password").val(),
	}
	$.ajax({
		type: "POST",
		url: "https://localhost:7244/account/login",
		data: JSON.stringify(user),
		dataType: "json",
		contentType: "application/json",
		success: function (res) {
			console.log(res)
			if (res.code == 0) {
				swal({
					title: "SUCCESS",
					text: "Login Successfully",
					icon: "success",
					buttons: true,
					dangerMode: true,
				}).then(() => {
					if (res.user.typeUser == "1") {

						window.location.href = "./admin/admin.html"
					} else if (res.user.typeUser == "0") {
						window.location.href = "../index.html"
					}
				})
			} else {
				swal({
					title: "FAIL",
					text: res.message,
					icon: "warning",
					dangerMode: true,
				})
			}
		}
	})
})

//register page -------------------------------------------------------------------------------------- 
$("#register_form").submit((e) => {
	e.preventDefault();
	let user_register = {
		name: $("#name").val(),
		phoneNumber: $("#phonenumber").val(),
		username: $("#username").val(),
		password: $("#password").val(),
		confirmPassword: $("#confirmPassword").val(),
		email: $("#email").val(),
	}
	$.ajax({
		type: "POST",
		url: "https://localhost:7244/account/register",
		data: JSON.stringify(user_register),
		contentType: "application/json",
		success: function (res) {
			console.log(res)
			if (res.code == 0) {
				swal({
					title: "SUCCESS",
					text: "Login Successfully",
					icon: "success",
					buttons: true,
					dangerMode: true,
				}).then(() => {
					window.location.href = "./login.html"
				})
			} else {
				swal({
					title: "FAIL",
					text: res.message,
					icon: "warning",
					dangerMode: true,
				})
			}
		}
	})
})
//-------------------------------------------------------------------------------------------
//Index page ------------------------------------------------------------------------------
if (location.pathname.includes("web-fashion/index.html")||location.pathname.includes("web-fashion") || location.pathname.includes("index.html")) {
	loadProduct("shoes");
	loadProduct("clothes");
	loadProduct("jewels");
}
function loadProduct(typeProduct) {
	$.ajax({
		type: 'GET',
		url: 'https://localhost:7244/product/search/',
		data: { key: typeProduct },
		cache: false,
		success: function (res) {
			if (res.code == 0) {
				console.log(res)
				ShowProduct(res.products, typeProduct)
			}

		}
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
							<a href="./product/detailProduct.html?id=${product.id}" class="container__product-name">${product.productName}</a>
						</div>
						<span class="container__product--price-sale">5.000.000₫</span>
						<span class="container__product--main-price">${product.price}₫</span>
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
			}else if(typeProduct == "jewels"){
				$("#product_jewels").append(html);
			}

		})
	}
	// <div class="container__product-banner"></div> //main img
	// <div class="container__banner"></div>// img panner hover
	// <div class="container__product--new">New</div> new product
	// <div class="container__product--hot">Hot</div> hot product
	// <div class="container__product--percent">23%</div> discount product
}
//----------------------------------------------------------------------------------------------------------
///detail product page---------------------------------------------------------------------------------
if (location.pathname.includes("detailProduct")) {
	loadDetailProduct()
}
function getIdDetails() {
	var urlParams;
	(window.onpopstate = function () {
		var match,
			pl = /\+/g,  // Regex for replacing addition symbol with a space
			search = /([^&=]+)=?([^&]*)/g,
			decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
			query = window.location.search.substring(1);

		urlParams = {};
		while (match = search.exec(query))
			urlParams[decode(match[1])] = decode(match[2]);
	})();
	return urlParams
}
function loadDetailProduct() {
	let id = getIdDetails().id
	$.ajax({
		type: 'GET',
		url: 'https://localhost:7244/product/search/',
		data: { key: id },
		cache: false,
		success: function (res) {
			if (res.code == 0) {
				showDetailProduct(res.products[0])
				getSameProduct(res.products[0].typeProduct)
			}
		}
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
						<a href="#" class="collection__item-shoes-name">${productDetails.productName}</a>
						<p class="collection__item-desc">
							
						</p>
						
						<h3 class="collection__item--price-sale">${productDetails.price}₫ </h3>
						<span class="collection__item--main-price">${productDetails.price}</span>₫</span>
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
					</div>
					<button class="btn-add" > Thêm vào giỏ hàng</button> 
				</div>
			</div> 
			
		`
		let detail_product=`

			<p class="collection__item-detail-desc">
				${productDetails.description}
				<h4 class="collection__item--size-sale"> Size : ${productDetails.size} &nbsp; &nbsp; &nbsp; Discount : ${productDetails.discount} %</h4>
			</p>
		`
		$("#description_product").append(detail_product)
		$('#detail_product').append(detail)

	}
}
function getSameProduct(key) {
	$.ajax({
		type: 'GET',
		url: 'https://localhost:7244/product/search/',
		data: { key: key },
		cache: false,
		success: function (res) {
			console.log(res)
			if (res.code == 0) {
				showSameProduct(res.products)
			}
		}
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
							<a href="detailProduct.html?id=${product.id}" class="container__product-name">${product.productName}</a>
							<span style="display: block;" class="container__product--price-sale">${product.price}đ</span>
							<span class="container__product--main-price">${product.price}₫</span>                                               
						</div>
					</div>
				</div>
			</div>    
			
			`;
		})

	}
	$("#same-product").append(html);

}

//----------------------------------------------------------------------------------------


//ADMIN
if (location.pathname.includes("products.html")) {
	getAllProductsAdmin()
}
function getAllProductsAdmin() {
	$.ajax({
		type: 'GET',
		url: 'https://localhost:7244/product/getall',
		cache: false,
		success: function (res) {
			console.log(res)
			if (res.code == 0) {
				showListProductAdmin(res.products)
			}
		}
	});
}
function showListProductAdmin(products) {
	products.forEach(function (product) {
		let html = `
			<tr id="row_${product.id}">
			<th scope="row">
			<input type="checkbox" />
			</th>
			<td class="tm-product-name"><a href="edit-product.html?id=${product.id}">${product.productName}</a></td>
			<td>1,450</td>
			<td>${product.amount}</td>
			<td>${product.price}</td>
			<td>
			<a href="#" onclick=" deleteProductAdmin('${product.id}')" class="tm-product-delete-link">
				<i class="far fa-trash-alt tm-product-delete-icon"></i>
			</a>
			</td>
		</tr>
		`
		$("#list-product").append(html)
	})
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
				type: 'DELETE',
				url: 'https://localhost:7244/admin/product/delete?key=' + key,
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
						})
					}
				}
			});
		}
	})
}
if (location.pathname.includes("edit-product.html")) {
	let id = getIdDetails().id;
	showDetailEditProduct(id);
}
function showDetailEditProduct(productID) {
	$.ajax({
		type: 'GET',
		url: 'https://localhost:7244/product/search?key=' + productID,
		cache: false,
		success: function (res) {
			$("#id").val(productID),
			$("#productName").val(res.products[0].productName),
			$("#productId").val(res.products[0].productId),
			$("#price").val(res.products[0].price),
			$("#amount").val(res.products[0].amount),
			$("#discount").val(res.products[0].discount),
			$("#size").val(res.products[0].size),
			$("#description").val(res.products[0].description)
			$('select[name="typeProduct"]').find(`option[value=${res.products[0].typeProduct}]`).attr("selected",true);
			let html =
				`
				<div style="height: auto" class="tm-product-img-dummy mx-auto">
				<img id="imgLink" src="${res.products[0].imgLink}" alt=""/>
				</div>
				<br>
				`
			$('.upload_review-list').html('');
			$('.upload_review-list').prepend(html)
		}
	})
}