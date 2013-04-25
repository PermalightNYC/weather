$(function() {

function success(position) {
  var $temps = $('ol.temps');

  var apicall = 'http://api.wunderground.com/api/d693c724ca3eb165/geolookup/q/' + position.coords.latitude + ',' + position.coords.longitude + '.json';

  $.ajax({
    url: apicall,
    dataType: 'jsonp',
    success: function(data) {
      $('li#loading').hide();
      var city = data.location.city,
      state = data.location.state;
      getHourlyWeather(city, state);
    }
  });

  function getHourlyWeather(city, state) {
    $.ajax({
      url: 'http://api.wunderground.com/api/d693c724ca3eb165/hourly/q/' + state + '/' + city + '.json',
      dataType: 'jsonp',
      success: function(data) {
        console.log(data);
        for (var i = 0; i < 25; i++) {
          var temp = data.hourly_forecast[i].temp.english,
          icon = data.hourly_forecast[i].icon,
          hour = data.hourly_forecast[i].FCTTIME.hour;
          hoursuffix = data.hourly_forecast[i].FCTTIME.ampm;
          time = hour + hoursuffix;
          icon = icon.replace('mostly','partly');
          if(hour >= 19 || hour < 6) {
            icon = icon + 'night';
          } else if (hour < 19 && hour >= 6) {
            icon = icon + 'day';
          }
          icon = icon.replace('clearnight', 'moon').replace('clearday','clear').replace('partlycloudyday', 'partlycloudy').replace('partlycloudynight','cloudynight').replace('tstormsnight','rainynight').replace('rain','rainy').replace('chance','');
          time = time.replace('0AM','12AM')
          addTempElements(temp, time, icon);
        } // for loop
      }
    });
  }

  function addTempElements(temp, time, icon) {
    elements = '<li><div class="temp">' + temp + '&deg;</div><div class="time">' + time + '</div><div class="ss-icon ss-forecast">' + icon + '</div></li>';
    $(elements).appendTo('.temps')
  }

}

function error(msg) {
  
  document.write('Sorry, something went wrong.');
  // console.log(arguments);
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, error);
} else {
  error('not supported');
}

});
