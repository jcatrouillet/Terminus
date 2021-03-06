var loadel;
function start_game(){
  // prepare game loading
  var has_save=state.startCookie('terminuscookie');
  var choices=[_('cookie_yes'),_('cookie_no')];
  if (has_save) choices.unshift(_('cookie_yes_load'));
  
  var game_start=function(vt, use_cookies){
     vt.muteSound();
    var loaded=false;
    if (pogencnt>0){ vt.show_msg(_('pogen_alert',pogencnt)); }
    if ((use_cookies - (has_save?1:0))<=0){ // yes new game or load
      state.setCookieDuration(7*24*60);// in minutes
      if(use_cookies==0){// load
        loaded=state.loadCookie();
      } 
    } else {// do not use cookie
      state.stopCookie();
    }
    vt.clear();
    vt.setContext(state.getCurrentRoom());
    if (loaded){
      vt.unmuteSound();
      vt.notification(_("game_loaded"));
      vt.show_msg( vt.context.getStarterMsg());
      vt.enable_input();
    } else {
      vt.muteCommandResult();
      music.play('preload');
      var seq=new Seq();
      seq.then(function(next){
        vt.show_loading_element_in_msg(['_',' '],{duration:800,finalvalue:' ',callback:next});
      });
      seq.then(function(next){
        vt.unmuteSound();
        vt.show_msg([_('gameintro_text_initrd'),next],{});
      });
      seq.then(function(next){
        loadel=dom.Id('initload');
        vt.show_loading_element_in_msg(['/\'','\'-',' ,','- '],{
          el:loadel,finalvalue:"<span class='color-ok'>"+_('gameintro_ok')+"</span>",
          duration:800,callback:next});
      });
      seq.then(function(next){
        vt.show_msg([_('gameintro_text_domainname'),next]);
      });
      seq.then(function(next){
        loadel=dom.Id('domainsetup');
        vt.show_loading_element_in_msg(['/\'','\'-',' ,','- '],{
          el:loadel,finalvalue:"<span class='color-ok'>"+_('gameintro_ok')+"</span>",
          duration:800,callback:next});
      });
      seq.then(function(next){
        vt.show_msg([_('gameintro_text_fsck'),next]);
      });
      seq.then(function(next){
        loadel=dom.Id('initfsck');
        vt.show_loading_element_in_msg(['/\'','\'-',' ,','- '],{
          el:loadel,finalvalue:"<span class='color-ko'>"+_('gameintro_failure')+"</span>",
          duration:800,callback:next});
      });
      seq.then(function(next){
        vt.show_msg([_('gameintro_text_terminus'),next]);
      });
      seq.then(function(next){
        vt.show_msg(_('gamestart_text'));
        music.play('story');
        vt.enable_input();
        vt.auto_shuffle_input_msg(_('press_enter'),0.9,0.1,8,20,null,50);
      });
      vt.battlescene(minigame_start,function(){
        music.play();
        vt.flash(0,800);
        seq.next();
      });
    }
  };

  // build view
  vt=new VTerm('term');
  vt.soundbank=snd; 
  vt.charduration=20; 
  vt.charfactor[' ']=25;//on each nbsp , it will take 1/2 second
  vt.disable_input();
  _addGroup('cat');
  _addGroup('dir');
  vt.flash(0,800);
  vt.epic_img_enter('titlescreen.gif','epicfromright',800,
    function(vt){
      if (TESTING){
        vt.enable_input();
        vt.setContext(state.getCurrentRoom());
        do_test();
      } else {
        music.play('title',{loop:true});
        vt.ask_choose(_('cookie'), choices,game_start,{direct:true});
      }
    });

}
