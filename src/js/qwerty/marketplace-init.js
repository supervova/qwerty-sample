/* eslint-disable */

function getblock() {
	if (loadingdata == 0)
	{
		lastcall = new Date().getTime();
		location_country = document.getElementById('cclist').value;
		searchtext = document.getElementById('searchtext').value;
		this_region = document.getElementById('this_region').value;
		this_region_lng = document.getElementById('this_region_lng').value;
		costfrom = document.getElementById('costfrom').value;
		costto = document.getElementById('costto').value;
		curr = document.getElementById('usercurr').value;
		loadingdata = 1;
		document.getElementById('loadingdata').style.display = 'block';
		$(".endblock").removeClass("endblock");
		if (lasteventtime == 0)
		{
			$('#datablock').html('');
		}
		$.ajax({
		url: './getmarketplace.php',
		type: 'POST',
		async: false,
		data: { lasteventtime: lasteventtime, searchtext: searchtext, location_country: location_country, this_region: this_region, this_region_lng: this_region_lng, costfrom: costfrom, costto: costto, curr: curr, mpcountry: '{$mpcountry}', cat: {$thiscat}, myads: {$mylogic} },
		success: function(response) {
			if (lasteventtime == 0)
			{
				$('#datablock').html(response);

			}
			else
			{
				$('#datablock').append(response);

			}
			loadingdata = 0;
			document.getElementById('loadingdata').style.display = 'none';
			$('[data-toggle="tooltip"]').tooltip();
			showblock();
		},
		error: function(response) {
			loadingdata = 0;
			getblock();
		}
		});
	}
}
function showblock() {
	if (loadingdata == 0)
	{
		for(var i=0;i<$('.endblock').get().length;i++)
		{
			var item = document.getElementsByClassName('endblock');
			var itemFirst = item[i];
			if (elementInViewport(itemFirst) || lasteventtime == 0)
			{
				getblock();
			}
		}
	}
}
function checkregion() {
	var location_country = document.getElementById('cclist').value;
	var this_region_lng = document.getElementById('this_region_lng').value;
	if (this_region_lng != '')
	{
		if (this_region_lng != '{$this_region_lng}')
		{
			$.ajax({
				url: './regionlng.php',
				type: 'POST',
				data: { region_lng: this_region_lng, usercountry: location_country },
				async: false,
				success: function(response) {
					response = $.parseJSON(response);
					if (response[0] == 'OK')
					{
						document.getElementById('this_region').value = response[1];
						document.getElementById('this_region_lng').value = response[2];
						getnew(100);
					}
				}
			});
		}
		else
		{
			document.getElementById('this_region').value = '{$this_region}';
			document.getElementById('this_region_lng').value = '{$this_region_lng}';
		}
	}
	else
	{
		document.getElementById('this_region').value = '';
		document.getElementById('this_region_lng').value = '';
	}
}
function keyupcity() {
	var this_region_lng = document.getElementById('this_region_lng').value;
	if (this_region_lng == '')
	{
		getnew(100);
	}
}
function getnew(delaysec = 1000) {
	adcountry = document.getElementById('cclist').value;
	var largeExpDate = new Date ();
	largeExpDate.setTime(largeExpDate.getTime() + (24 * 60 * 60 * 100000));
	SetCookieQwerty('mpcountry', adcountry, largeExpDate,'/','{$this2leveldomain}');
	searchcities(adcountry);
	if (adcountry != '')
	{
		document.getElementById('this_region_lng').disabled = false;
	}
	else
	{
		document.getElementById('this_region_lng').disabled = true;
	}
	$('#datablock').html('');
	document.getElementById('loadingdata').style.display = 'block';
	lastcall = new Date().getTime();
	setTimeout(function() {
		thiscall = new Date().getTime();
		diffms = thiscall - lastcall;
		if (diffms >= delaysec)
		{
			loadingdata = 0;
			lasteventtime = 0;
			getblock();
		}
	}
	,delaysec);
}
function searchcities(country_code) {
	$('.typeahead__result').remove();
	$('#this_region_lng').typeahead({
	minLength: 1,
	order: "asc",
	cache: false,
	maxItem: false,
	offset: true,
	source: {
		ajax: {
			type: "POST",
			url: "/json.php",
			data: {
				country_code: country_code, user_lng: '{$user_lng}'
			}
		}
	},
	callback: {
		onClick: function (node, a, item, event) {
			$('#this_region_lng').val(item.display);
			checkregion();
		}
	}
	});
}
function cartinfo() {
	mycart = GetCookieQwerty('mycart');
	if (mycart == null)
	{
		cartData = new Object();
		cartData.total = 0;
	}
	else
	{
		cartData = JSON.parse(mycart);
	}
	if (typeof cartData !== 'object')
	{
		cartData = new Object();
		cartData.total = 0;
	}
	if (cartData.total > 0)
	{
		$('#cartinfo').show();
		$('#cartinfo').html('<a href="/marketplace/cart"><span style="font-weight:500;">Your shopping cart: '+cartData.total+' {$select_curr_show}</span></a>');
	}
	else
	{
		$('#cartinfo').hide();
	}
}
$(document).ready(function(){
	loadingdata = 0;
	lasteventtime = 0;
	window.onscroll = showblock;
	$('#usercurr').change(function(){
		getnew(100);
	});
	if ({$mylogic})
	{
		$('.allads').hide();
		$('.myads').show();
	}
	else
	{
		$('.allads').show();
		$('.myads').hide();
	}
	searchcities('{$user_country}');
	showblock();
	cartinfo();
});
