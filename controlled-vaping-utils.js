(function(){
 'use strict';
 function timeBucket(value){
  const match=String(value||'').match(/^(\d{1,2}):(\d{2})$/);
  if(!match)return -1;
  const hour=Number(match[1]),minute=Number(match[2]);
  if(hour>23||minute>59)return -1;
  return hour<6?0:hour<12?1:hour<18?2:3;
 }
 window.MVAControlledVapingUtils=Object.freeze({timeBucket});
})();