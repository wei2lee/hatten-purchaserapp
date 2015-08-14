var property1 = {
    project: {
        thumb:'img/properties_logo/Hatten_harbourcity.png',
        displayName:'Hatten'
    },
    id:0,
    displayName: 'Harbour City',
    thumb:'img/properties_images/HarbourCity_A3009-Aerial-View-Day_New.jpg',
    type:0,
}
property1.description = 
    '<h4>Description</h4>' + '<p>Harbour City brings together a Theme Park, Shopping Mall and 3 Hotels in one exciting location amidst a tropical man-made island. A unique holiday destination for the entire family to enjoy, Harbour City offers adventure, leisure and fun for all.</p>' +
    '<h4>Theme Park</br>Experience the Thrills of The Indoor Theme Park</h4>' + '<p>A unique feature of Harbour City is the large indoor theme park. Perfect for fun-filled adventures with the whole family. Experience the adrenaline rush of a 3-storey roller coaster or just enjoy a more leisurely time on the kid-friendly rides.</p>' +
    '<h4>Retail Mall<br/>Navigate The Depths of Retail Excitement</h4>' + '<p>Be enthralled by the ultimate shopping experience as you stroll down the aisles of a stunning mall inspired by the mesmerizing panorama of marine life. At Harbour City Mall, you have the pleasure of international retail, a unique ambience and a myriad of cultural and historic attractions within the vicinity.</p>' +
    '<h4>Cruise-Themed Hotel<br/>A Cruise Liner’s Touch In Its Own Elements</h4>' + '<p>Enjoy the excitement of a luxury cruise surrounded by sun, sand and sea. All you need is a quick getaway and ‘cruise’ aboard the Harbour City Hotel.</p>' + 
    '<hr>'+
    '<h4>Property Details</h4>' + 
    '<ul>' +
    '<li>Project Name : Harbour City</li>' + 
    '<li>Location : Pulau Melaka, Melaka</li>' + 
    '<li>Type : Mixed development</li>' + 
    '<li>Tenure : Leasehold</li>' + 
    '<li>Completion Date : Q4, 2018</li>' +
    '</ul>';

var property2 = {
    project: {
        thumb:'img/properties_logo/Hatten_unicitymall.png',
        displayName:'Hatten'
    },
    id:1,
    displayName: 'UniCity',
    thumb:'img/properties_images/UniCity_entrance_Final.jpg',
    type:0,
}
property2.description = 
    '<h4>Description</h4>' + '<p></p>' +
    '<p>The formula for success is now customised to suit you. UNICITY, an all new lifestyle campus mall, offers you the opportunity to capitalise on solid commercial-retail strategies with low-gearing costs and guaranteed high rental returns on investments. </p>' +
    '<p>Catering to a vast youth market, you can rest assured that your investments will grow and flourish in a high-potential, creative and vibrant atmosphere. </p>' + 
    '<p>UNICITY is your future in retail.  </p>' + 
    '<ul>' + 
    '<li>F&B Zone</li>' + 
    '<li>Internet Cafe</li>' + 
    '<li>Bookstore</li>' + 
    '<li>Convenience Store</li>' + 
    '<li>Laundrette</li>' + 
    '</ul>' +
    '<hr>' +
    '<h4>Property Details</h4>' + 
    '<ul>' +
    '<li>Project Name : Unicity Lifestyle Campus Mall</li>' + 
    '<li>Location : Pulau Melaka, Melaka</li>' + 
    '<li>Type : Seremban 3, Negeri Sembilan</li>' + 
    '<li>Tenure : Commercial</li>' + 
    '<li>Completion Date : Q2, 2017</li>' +
    '</ul>';

var property3 = {
    project: {
        thumb:'img/properties_logo/Hatten_imperioresidence.png',
        displayName:'Hatten'
    },
    id:2,
    displayName: 'Imperio Mall',
    thumb:'img/properties_images/Imperio_KL2124-Entrance.jpg',
    type:0,
}
property3.description = 
    '<h4>Description</h4>' + '<p>Imperio @ Hatten City, the much-anticipated and newest luxurious integrated development in Hatten City has given the needed excitement and boost to the property scene at the Straits of Melaka. With upwardly-mobile professionals in mind, Hatten Group proudly launches the distinctive and iconic 33-storey, Imperio Mall and Residence. This spectacular composition of retail experience, vibrant lifestyle and premier home living, all under one roof, will set a new benchmark in lifestyle standards for Melaka.' +
    '<hr>'+
    '<h4>Property Details</h4>' + 
    '<ul>' +
    '<li>Project Name : Imperio @ Hatten City</li>' + 
    '<li>Location : Melaka Raya, Melaka</li>' + 
    '<li>Type : Mixed Development</li>' + 
    '<li>Tenure : Leasehold</li>' + 
    '<li>Completion Date : Q2, 2017</li>' +
    '</ul>';


faker.table = {};
faker.table.properties = function() {
    return [property1, property2, property3];  
};


faker.image.projectLogo = function() {
    var arr = ['Hatten_capital21.png',
    'Hatten_dataran.png',
    'Hatten_element.png',
    'Hatten_estadia.png',
    'Hatten_harbourcity.png',
    'Hatten_hattenhotel.png',
    'Hatten_hattensquare.png',
    'Hatten_hattensuites.png',
    'Hatten_imperiomall.png',
    'Hatten_imperioresidence.png',
    'Hatten_micc.png',
    'Hatten_ricomall.png',
    'Hatten_ricoview.png',
    'Hatten_silverscape.png',
    'Hatten_terminal.png',
    'Hatten_unicitymall.png',
    'Hatten_unicitysuites.png',
    'Hatten_vedro.png'];
    
    return 'img/properties_logo/' + arr[_.random(arr.length - 1)];
};

faker.image.event = function() {
    var arr = ['dining-area.jpg',
    'Hatten_birthday.png',
    'Hatten_homepage1.png'];
    return 'img/images_dummy_only/' + arr[_.random(arr.length - 1)];
    
};

faker.image.construction = function() {
    var arr = [
    'Harbour-city-02.jpg',
    'Harbour-city.jpg',
    ];
    return 'img/HarbourCityProgressImages/' + arr[_.random(arr.length - 1)];
}

faker.image.progress = function() {
    var arr = [
    'Harbour-city-02.jpg',
    'Harbour-city.jpg',
    ];
    return 'img/HarbourCityProgressImages/' + arr[_.random(arr.length - 1)];
}

faker.image.property = function() {
    var arr = [
'Capital_KL3092-hattern-building_c02-eyelevel-night-view3.jpg ',
'DataranPahlawan_side-entrance_04-hires.jpg   ',
'Element_heritage_03.jpg    ',
'Elements-city_view-day.jpg  ',
'Estadia_Concierge-Final.jpg   ',
'Estadia_Reception-Latest.jpg   ',
'HH_01.jpg    ',
'HarbourCity_A3009-Aerial-View-Day_New.jpg  ',
'HarbourCity_A3009-C03-night.jpg   ',
'HarbourCity_A3009-Facilities-View.jpg   ',
'HarbourCity_Grd-Flr---Ticketing-Counter.jpg',
'HarbourCity_Hotel-Type-B-Updated-cmyk.jpg',
'HattenHotel_Terminal-Pahlawan-CMYK.jpg  ',
'HattenSquare_IMG_5645.jpg    ',
'HattenSuite_DJI00316_edit.jpg    ',
'HattenSuites_IMG_8971.jpg    ',
'Imperio_KL2124-Building-C02.jpg    ',
'Imperio_KL2124-C29-Pool-View.jpg   ',
'Imperio_KL2124-Entrance.jpg    ',
'Imperio_perspective-02(2).jpg   ',
'Silverscape_seaview-evening.jpg   ',
'Silverscape_sky_garden_aerial_01.jpg    ',
'Terminal_Rear-Evening.jpg   ',
'UniCity_entrance_Final.jpg    ',
'Unicity_Facade_day_Final.jpg    ',
'Unicity_bedroom-final.jpg   ',
'Vedro_confirmed_1_edited.jpg    ',
        ];
    return 'img/properties_images/' + arr[_.random(arr.length - 1)];
}

faker.company.projectName = function() {
    var arr = [
    'Harbour City',
    'Dataran Pahlawan',
    'Elements City',
    'Hatten Hotel',
    'Hatten Square',
    'Imperio',
    'Silverscape',
    'Terminal Rear',
    'UniCity',
    'Vedro'
    ];
    return arr[_.random(arr.length - 1)];
}

faker.company.propertyName = function() {
    var arr = [
    'Harbour City',
    'Dataran Pahlawan',
    'Elements City',
    'Hatten Hotel',
    'Hatten Square',
    'Imperio',
    'Silverscape',
    'Terminal Rear',
    'UniCity',
    'Vedro'
    ];
    return arr[_.random(arr.length - 1)];
}

faker.id = {
    unitNo : function() {
        return sprintf('%s-%02d-%02d', ['A','B','C'][_.random(2)], _.random(99), _.random(99));  
    },
    unitId : function() {
        return _.random(99999);
    }
    
}

faker.image.qrcode = function() {
    return 'http://www.campusbookstore.com/MobileBuyBack/QR-AppStore.png';   
}

function fakeNetworkFunctionCall(f) {
    $timeout(f, Math.random() * 1000); 
}

