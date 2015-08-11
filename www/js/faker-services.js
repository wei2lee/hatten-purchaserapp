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
    console.log(_.random(arr.length - 1));
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