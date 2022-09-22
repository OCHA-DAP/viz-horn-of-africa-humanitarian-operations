/*************************/
/*** TOOLTIP FUNCTIONS ***/
/*************************/
function createMapTooltip(country_code, country_name, point) {
  var location = adminone_data.filter(c => c['#adm1+code'] == country_code);
  if (location[0]!=undefined) {
    var val = location[0][currentIndicator.id];

    //format content for tooltip
    if (!isVal(val)) {
      val = 'No Data';
    }

    //format content for display
    var content = `<h2>${country_name}, ${location[0]['#country+name']}</h2>`;

    //ipc layer
    // if (currentIndicator.id=='#affected+food+ipc+p3plus+num') {
    //   var shortVal = (isNaN(val)) ? val : shortenNumFormat(val);
    //   content += 'Total Population in IPC Phase 3+: <div class="stat">' + shortVal + '</div>';
      // var dateSpan = '';
      // if (country[0]['#date+ipc+start']!=undefined) {
      //   var startDate = new Date(country[0]['#date+ipc+start']);
      //   var endDate = new Date(country[0]['#date+ipc+end']);
      //   startDate = (startDate.getFullYear()==endDate.getFullYear()) ? d3.utcFormat('%b')(startDate) : d3.utcFormat('%b %Y')(startDate);
      //   var dateSpan = '<span class="subtext">('+ startDate +'-'+ d3.utcFormat('%b %Y')(endDate) +' - '+ country[0]['#date+ipc+period'] +')</span>';
      // }
      // var shortVal = (isNaN(val)) ? val : shortenNumFormat(val);
      // content += 'Total Population in IPC Phase 3+ '+ dateSpan +':<div class="stat">' + shortVal + '</div>';
      // if (val!='No Data') {
      //   if (country[0]['#affected+food+ipc+analysed+num']!=undefined) content += '<span>('+ shortenNumFormat(country[0]['#affected+food+ipc+analysed+num']) +' of total country population analysed)</span>';
      //   var tableArray = [{label: 'IPC Phase 3 (Critical)', value: country[0]['#affected+food+ipc+p3+num']},
      //                     {label: 'IPC Phase 4 (Emergency)', value: country[0]['#affected+food+ipc+p4+num']},
      //                     {label: 'IPC Phase 5 (Famine)', value: country[0]['#affected+food+ipc+p5+num']}];
      //   content += '<div class="table-display">Breakdown:';
      //   tableArray.forEach(function(row) {
      //     if (row.value!=undefined) {
      //       var shortRowVal = (row.value==0) ? 0 : shortenNumFormat(row.value);
      //       content += '<div class="table-row"><div>'+ row.label +':</div><div>'+ shortRowVal +'</div></div>';
      //     }
      //   });
      //   content += '</div>';
      // }
    // }
    // else if (currentIndicator.id=='#climate+rainfall+anomaly') {
    //   var tableArray = [{label: 'Population', value: country[0]['#population']},
    //                     {label: 'Total Population in IPC Phase 3+', value: country[0]['#affected+food+ipc+p3plus+num']}];
    //   content += '<div class="table-display">';
    //   tableArray.forEach(function(row) {
    //     var shortRowVal = (row.value==0 || isNaN(row.value)) ? 'No Data' : shortenNumFormat(row.value);
    //     content += '<div class="table-row"><div>'+ row.label +':</div><div>'+ shortRowVal +'</div></div>';
    //   });
    //   content += '</div>';
    // }
    //all other layers
    //else {
    if (currentIndicator.id=='#affected+food+ipc+phase+type') {
      content += currentIndicator.name + ':<div class="stat">' + val + '</div>';
    }
    else if (currentIndicator.id=='#climate+rainfall+anomaly') {
      content += currentIndicator.name + ':<div class="stat">' + shortenNumFormat(val) + 'mm</div>';
    }
    else {
      content += currentIndicator.name + ':<div class="stat">' + shortenNumFormat(val) + '</div>';
    }
    //}

    var tableArray = [{label: 'Population', indicator: '#population'},
                      {label: 'Population in IPC Phase 3+', indicator: '#affected+food+ipc+p3plus+num'},
                      {label: 'People in Need', indicator: '#inneed'},
                      {label: 'People Targeted', indicator: '#targeted'}];
    content += '<div class="table-display">';
    tableArray.forEach(function(row) {
      if (row.indicator!=currentIndicator.id) {
        let value = location[0][row.indicator];
        let shortVal = (value==0 || isNaN(value)) ? 'No Data' : shortenNumFormat(value);
        content += '<div class="table-row"><div>'+ row.label +':</div><div>'+ shortVal +'</div></div>';
      }
    });
    content += '</div>';

    //set content for tooltip
    tooltip.setHTML(content);

    setTooltipPosition(point);
  }
}


function createCountryMapTooltip(name, pcode, point) {
  var location = admintwo_data.filter(function(c) {
    if (c['#adm2+code']==pcode && c['#country+code']==currentCountry.code)
      return c;
  });

  if (location[0]!=undefined) {
    var val = location[0][currentIndicator.id];
    var label = currentIndicator.name;

    //format content for tooltip
    if (!isVal(val)) {
      val = 'No Data';
    }

    if (currentIndicator.id=='#affected+food+ipc+phase+type' || 'currentIndicator.id'=='#priority' || isNaN(val))
      val = val;
    else if (currentIndicator.id=='#climate+rainfall+anomaly')
      val = shortenNumFormat(val) + 'mm';
    else 
      val = shortenNumFormat(val);

    let content = '';
    content = `<h2>${name}</h2>`;
    content += currentIndicator.name + ':<div class="stat">' + val + '</div>';
    var tableArray = [{label: 'Population', indicator: '#population'},
                      {label: 'Population in IPC Phase 3+', indicator: '#affected+food+ipc+p3plus+num'},
                      {label: 'People in Need', indicator: '#inneed'},
                      {label: 'People Targeted', indicator: '#targeted'}];
    content += '<div class="table-display">';
    tableArray.forEach(function(row) {
      if (row.indicator!=currentIndicator.id) {
        let value = location[0][row.indicator];
        let shortVal = (value==0 || isNaN(value)) ? 'No Data' : shortenNumFormat(value);
        content += '<div class="table-row"><div>'+ row.label +':</div><div>'+ shortVal +'</div></div>';
      }
    });
    content += '</div>';

    tooltip.setHTML(content);
    //if (!isMobile) setTooltipPosition(point)
  }
}


function setTooltipPosition(point) {
  var tooltipWidth = $('.map-tooltip').width();
  var tooltipHeight = $('.map-tooltip').height();
  var anchorDirection = (point.x + tooltipWidth > viewportWidth) ? 'right' : 'left';
  var yOffset = 0;
  if (point.y + tooltipHeight/2 > viewportHeight) yOffset = viewportHeight - (point.y + tooltipHeight/2);
  if (point.y - tooltipHeight/2 < 0) yOffset = tooltipHeight/2 - point.y;
  var popupOffsets = {
    'right': [0, yOffset],
    'left': [0, yOffset]
  };
  tooltip.options.offset = popupOffsets;
  tooltip.options.anchor = anchorDirection;

  if (yOffset>0) {
    $('.mapboxgl-popup-tip').css('align-self', 'flex-start');
    $('.mapboxgl-popup-tip').css('margin-top', point.y);
  }
  else if (yOffset<0)  {
    $('.mapboxgl-popup-tip').css('align-self', 'flex-end');
    $('.mapboxgl-popup-tip').css('margin-bottom', viewportHeight-point.y-10);
  }
  else {
    $('.mapboxgl-popup-tip').css('align-self', 'center');
    $('.mapboxgl-popup-tip').css('margin-top', 0);
    $('.mapboxgl-popup-tip').css('margin-bottom', 0);
  }
}