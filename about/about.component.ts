import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery'
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('.video1 > .playButton > .button > i').click(function(){
      $('.video2').removeClass('active');
      $('.video2 > *').removeClass('active');
      $('.video1 > .playButton:not(.active)').addClass('active');
      $('.video2 > video').remove();
      setTimeout(function(){
        $('.video1 > .videoImage:not(.active)').addClass('active');
        $('.video1').append('<video style="width:100%; height:100%" autoplay controls controlsList="nodownload" preload playsInline><source src="https://myintro.com/assets/video/v1.mp4" type="video/mp4"></video>');
      }, 400);
    });
    $('.video2 > .playButton > .button > i').click(function(){
      $('.video1').removeClass('active');
      $('.video1 > *').removeClass('active');
      $('.video2 > .playButton:not(.active)').addClass('active');
      $('.video1 > video').remove();
      setTimeout(function(){
        $('.video2 > .videoImage:not(.active)').addClass('active');
        $('.video2').append('<video style="width:100%; height:100%" autoplay controls controlsList="nodownload" preload playsInline><source src="https://myintro.com/assets/video/v2.mp4" type="video/mp4"></video>');
      }, 400);
    });
  }

}
