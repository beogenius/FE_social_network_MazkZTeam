import {Component, OnInit} from '@angular/core';

declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'FE-social-networt-MazkZTeam';

  ngOnInit(): void {
    jQuery(document).ready(function() {

      $('#us3').locationpicker({
        location: {
          latitude: -8.681013,
          longitude: 115.23506410000005
        },
        radius: 0,
        inputBinding: {
          latitudeInput: $('#us3-lat'),
          longitudeInput: $('#us3-lon'),
          radiusInput: $('#us3-radius'),
          locationNameInput: $('#us3-address')
        },
        enableAutocomplete: true,
        onchanged: function (currentLocation: any, radius: any, isMarkerDropped: any) {
          // Uncomment line below to show alert on each Location Changed event
          //alert("Location changed. New location (" + currentLocation.latitude + ", " + currentLocation.longitude + ")");
        }
      });

      if ($.isFunction($.fn.toast)) {
        $.toast({
          heading: 'Welcome To Pitnik',
          text: '',
          showHideTransition: 'slide',
          icon: 'success',
          loaderBg: '#fa6342',
          position: 'bottom-right',
          hideAfter: 3000,
        });

        $.toast({
          heading: 'Information',
          text: 'Now you can full demo of pitnik and hope you like',
          showHideTransition: 'slide',
          icon: 'info',
          hideAfter: 5000,
          loaderBg: '#fa6342',
          position: 'bottom-right',
        });
        $.toast({
          heading: 'Support & Help',
          text: 'Report any <a href="#">issues</a> by email',
          showHideTransition: 'fade',
          icon: 'error',
          hideAfter: 7000,
          loaderBg: '#fa6342',
          position: 'bottom-right',
        });
      }
    });
  }
}
