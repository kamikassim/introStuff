import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery'

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {


  test() {
    return "test";
  }

  parseForm(formArray) {//serialize data function
    formArray = JSON.parse(JSON.stringify(formArray));
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
      returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
  }

  formHandler() {
    $('form').submit((e) => {
      e.preventDefault();
      // console.log("clicked");

      var formData = this.parseForm($(this).serializeArray());
      // console.log(formData.item);
      // $('#user_content').addClass('open');

      switch (formData['item']) {
        case '1':
          $('#user_content > .custom_content > .video').html('<video><source src=assets/video/solo.mp4 type=\"video/mp4\"></video>');
          $('#user_info > td > .container > .info > .name').html("Solomon Arnett");
          $('#user_info > td > .container > .info > .skill').html("Software Consultant");
          $('#user_info > td > .container > .image').attr("style", "background-image: url(\"assets/img/users/solo.png\");");
          $('#user_description > td').html("I'm an experienced developer that builds mobile first.<br><br>Thank you for taking the time to test drive this demo of the sort of experience you can expect to provide for your 'Web Only' customers.");
          $('#user_university > td > .university').html("Georgia State University");
          $('#user_university > td > .major').html("Computer Science");
          $('#user_five_words > td > .words').html("<span>#Focused</span><span>#Productive</span><span>#Determined</span><span>#Outspoken</span><span>#Passionate</span>")

          // 
          break;
        case '2':
          $('#user_content > .custom_content > .video').html("<video controls><source src=assets/video/viraj.mp4 type=\"video/mp4\"></video>");
          $('#user_info > td > .container > .info > .name').html("Viraj Shah");
          $('#user_info > td > .container > .info > .skill').html("Software Consultant");
          $('#user_info > td > .container > .image').attr("style", "background-image: url(\"assets/img/users/viraj.jpg\");");
          $('#user_description > td').html("Hey! Welcome to my profile. My name is Viraj and I am a software engineer! I started writing code in High School and every since then I’ve never stopped.");
          $('#user_university > td > .university').html("Georgia State University");
          $('#user_university > td > .major').html("Computer Science");
          $('#user_five_words > td > .words').html("<span>#Hardworking</span><span>#Diligent</span><span>#TeamPlayer</span><span>#Sociable</span><span>#Honest</span>")

          // 
          break;
        case '3':
          $('#user_content > .custom_content > .video').html("<video><source src=assets/video/teo.mp4 type=\"video/mp4\"></video>");
          $('#user_info > td > .container > .info > .name').html("Matteo Santavicca");
          $('#user_info > td > .container > .info > .skill').html("Business Analyst");
          $('#user_info > td > .container > .image').attr("style", "background-image: url(\"assets/img/users/teo.jpg\");");
          $('#user_description > td').html("I can't wait to meet you.");
          $('#user_university > td > .university').html("Georgia State University");
          $('#user_university > td > .major').html("Business Management");
          $('#user_five_words > td > .words').html("<span>#Results</span><span>#Diligent</span><span>#Determined</span>")

          // 
          break;
        default:
          break;
      }

      $('.inner_content > .bottom_bar > .item').addClass("hidden");
      setTimeout(function () {
        $('#user_content').addClass('open');
      }, 250);

    });
  }

  arrowHandler() {
    $('.arrow').click(function () {
      $('#user_content > .custom_content > .video').html("");
      $('#user_content').addClass('close');
      setTimeout(function () {
        $('#user_content').removeClass('open');
        $('#user_content').removeClass('close');
        $('.inner_content > .bottom_bar > .item').addClass("visible");
        setTimeout(function () {
          $('.inner_content > .bottom_bar > .item').removeClass("hidden");
          $('.inner_content > .bottom_bar > .item').removeClass("visible");
        }, 400);
      }, 400);
    });
  }

  viewItHandler() {
    $('#viewIt').click(function () {
      if ($('#phone').hasClass("android")) {
        $('#phone').removeClass('android');
        $('#viewIt').html("View it on Android");
      } else {
        $('#phone').addClass('android');
        $('#viewIt').html("View it on iPhone");
      }
    });
  }

demoOrder = [];

startDemo() {
  this.demoOrder[0] = setTimeout(function () {
    $('#demo_facebook_login').addClass('visible');
    $('#demo_start_screen').addClass('away');
  }, 3000);

  this.demoOrder[1] = setTimeout(function () {
    $('#demo_facebook_login').addClass('away');
    $('#demo_agree_to_terms').addClass('visible');
  }, 6000);

  this.demoOrder[2] = setTimeout(function () {
    $('#demo_agree_to_terms').addClass('away');
    $('#demo_opportunities').addClass('visible');
    $('#demo_opportunities2').addClass('visible');
  }, 9000);

  this.demoOrder[3] = setTimeout(function () {
    $('#demo_opportunities2').addClass('opaque');
  }, 10000);

  this.demoOrder[4] = setTimeout(function () {
    $('#demo_opportunities').addClass('away');
    $('#demo_opportunities2').addClass('away');
    $('#demo_five_words').addClass('visible');
    $('#demo_five_words2').addClass('visible');
    $('#demo_five_words3').addClass('visible');
    $('#demo_five_words4').addClass('visible');
    $('#demo_five_words5').addClass('visible');
    $('#demo_five_words6').addClass('visible');
    $('#demo_five_words7').addClass('visible');
  }, 13000);

  this.demoOrder[5] = setTimeout(function () {
    $('#demo_five_words2').addClass('opaque');
  }, 14000);

  this.demoOrder[6] = setTimeout(function () {
    $('#demo_five_words3').addClass('opaque');
  }, 15000);

  this.demoOrder[7] = setTimeout(function () {
    $('#demo_five_words4').addClass('opaque');
  }, 16000);

  this.demoOrder[8] = setTimeout(function () {
    $('#demo_five_words5').addClass('opaque');
  }, 17000);

  this.demoOrder[9] = setTimeout(function () {
    $('#demo_five_words6').addClass('opaque');
  }, 18000);

  this.demoOrder[10] = setTimeout(function () {
    $('#demo_five_words7').addClass('opaque');
  }, 19000);

  this.demoOrder[11] = setTimeout(function () {
    $('#demo_five_words').addClass('away');
    $('#demo_five_words2').addClass('away');
    $('#demo_five_words3').addClass('away');
    $('#demo_five_words4').addClass('away');
    $('#demo_five_words5').addClass('away');
    $('#demo_five_words6').addClass('away');
    $('#demo_five_words7').addClass('away');
    $('#demo_profile').addClass('visible');
    $('#demo_profile2').addClass('visible');
    $('#demo_profile3').addClass('visible');


    // $('#demo_companies').addClass('visible');
    // $('#demo_companies2').addClass('visible');
  }, 22000);

  this.demoOrder[12] = setTimeout(function () {
    $('#demo_profile2').addClass('opaque');
  }, 24000);
  this.demoOrder[13] = setTimeout(function () {
    $('#demo_profile3').addClass('opaque');
  }, 26000);

  this.demoOrder[14] = setTimeout(function () {
    $('#demo_profile').addClass('away');
    $('#demo_profile2').addClass('away');
    $('#demo_profile3').addClass('away');
    $('#demo_companies').addClass('visible');
    $('#demo_companies2').addClass('visible');
  }, 28000);

  this.demoOrder[15] = setTimeout(function () {
    $('#demo_companies2').addClass('opaque');
  }, 30000);

  this.demoOrder[16] = setTimeout(function () {
    $('#demo_companies').addClass('away');
    $('#demo_companies2').addClass('away');
    $('#demo_search').addClass('visible');
    $('#demo_search2').addClass('visible');
    $('#demo_search3').addClass('visible');
    $('#demo_search4').addClass('visible');
    $('#demo_accenture').addClass('visible');
    $('#demo_accenture2').addClass('visible');
    $('#demo_accenture_video').addClass('visible');

  }, 32000);

  this.demoOrder[17] = setTimeout(function () {
    $('#demo_search2').addClass('opaque');
  }, 33000);

  this.demoOrder[18] = setTimeout(function () {
    $('#demo_search3').addClass('opaque');
  }, 34000);

  this.demoOrder[19] = setTimeout(function () {
    $('#demo_search4').addClass('opaque');
  }, 35000);

  this.demoOrder[20] = setTimeout(function () {
    $('#demo_accenture').addClass('opaque');
    $('#demo_accenture_video').addClass('opaque');
    $('#demo_accenture_video').html('<video autoplay playsinline muted><source src=assets/video/accenture.mp4 type=\"video/mp4\"></video>');
  }, 37000);

  this.demoOrder[21] = setTimeout(function () {
    $('#demo_accenture2').addClass('opaque');
  }, 47000);

  this.demoOrder[22] = setTimeout(function () {
    $('#demo_accenture_video').html('');
    $('#demo_accenture_video').addClass('away');
    $('#demo_accenture2').addClass('away');
    $('#demo_friends').addClass('visible');
    $('#demo_friends2').addClass('visible');
    $('#demo_friends3').addClass('visible');
  }, 57000);

  this.demoOrder[23] = setTimeout(function () {
    $('#demo_friends2').addClass('opaque');
  }, 59000);

  this.demoOrder[24] = setTimeout(function () {
    $('#demo_friends3').addClass('opaque');
  }, 61000);

  this.demoOrder[25] = setTimeout(function () {
    $('#demo_friends').addClass('away');
    $('#demo_friends2').addClass('away');
    $('#demo_friends3').addClass('away');
    $('#demo_messages').addClass('visible');
  }, 64000);

  this.demoOrder[26] = setTimeout(function () {
    $('#demo_messages').addClass('away');
    $('#demo_messages2').addClass('visible');
  }, 67000);

  this.demoOrder[27] = setTimeout(function () {
    $('#demo_start_screen').removeClass('away');
    $('#demo.demo > *:not(#demo_start_screen)').removeClass('visible');
  }, 70000);
}
demoStarter() {
  $('#demoStarter').click(()=> {
    if ($('#demoStarter').hasClass('started')) {
      // end demo
      // $('#phone >.content>.inner_content').removeClass('hidden');
      // $('#demo').removeClass('visible');
      $('#demoStarter').removeClass('started');
      $('#demo_start_screen').removeClass('visible');
      $('#demoStarter').html('Start Demo');
      for (var i = 0; i < this.demoOrder.length; i++) {
        clearTimeout(this.demoOrder[i]);
      }



      $('#demo').removeClass('visible');
      setTimeout(function () {
        $('#demo').removeClass('zvisible');
        $('#demo > .screen').removeClass('visible').removeClass('away').removeClass('opaque');
        $('#demo_start_screen').addClass('visible');
      }, 400);

    } else {
      // start demo
      // $('#phone >.content>.inner_content').addClass('hidden');
      $('#demoStarter').addClass('started');
      // $('#demo_start_screen').addClass('visible');

      $('#demo').addClass('zvisible');
      setTimeout(function () {
        $('#demo').addClass('visible');
      }, 200);
      $('#demoStarter').html('End Demo');
      this.startDemo();
    }
  });
  // setTimeout(function(){
  $('#demoStarter').trigger("click");
  // }, 000);

}

highlight_home() {
  $('#nav').addClass('active');
  $('#link_download > span').addClass('active');
}

constructor() { }

ngOnInit() {
  this.highlight_home();
  this.formHandler();
  this.arrowHandler();
  this.viewItHandler();
  this.demoStarter();
}

}
