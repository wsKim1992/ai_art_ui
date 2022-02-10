/* fun little example using GreenSock's Draggable: https://www.greensock.com/draggable/ */

var content = document.getElementById("updown_right");

var maxScroll = content.scrollHeight - content.offsetHeight;
var sections = 9;

//when the user drags the knob, we must update the scroll position. We're using the special scrollProxy object of Draggable because it allows us to overscroll (normal browser behavior won't allow it to scroll past the top/bottom). 


//if the user flicks/spins/drags with momentum, a tween is created, but if the user interacts again before the tween is done, we must kill that tweens (so as not to fight with the user). This method kills any tweens of the knob or the content's scrollProxy.
function killTweens() {
  TweenLite.killTweensOf([dragContent.scrollProxy]);
}
content.addEventListener("mousewheel", killTweens);
content.addEventListener("DOMMouseScroll", killTweens);

//whenever the content gets scrolled (like by using the mousewheel or dragging the content), we simply set a flag indicating we need to update the knob's rotation. We use a "tick" handler later to actually trigger the update because that optimizes performance since ticks happen on requestAnimationFrame and we want to avoid thrashing
content.addEventListener("scroll", function() {
  needsRotationUpdate = true;
});

//create the content Draggable
Draggable.create(content, {
  type:"scrollTop", 
  edgeResistance:0.5, 
  throwProps:true,
  onDragStart: killTweens,
  snap: function(endValue) {
    var step = maxScroll / (sections - 1);
    console.log(Math.round( endValue / step) * -step);
    return Math.round( endValue / step) * -step;
  }
});

//grab the Draggable instances for the content and the knob, and store them in variables so that we can reference them in other functions very quickly. 
var dragContent = Draggable.get(content);
