var slider=function(){
	var array=[]; var speed=10; var timer=10;
	return{
		init:function(t,c){
			var s,ds,l,i,y;
			s=document.getElementById(t); ds=s.getElementsByTagName('div'); l=ds.length; i=y=0;
			for(i=0;i<l;i++){
				var d,did; d=ds[i]; did=d.id;
				if(did.indexOf("header")!=-1){
					y++; d.onclick=new Function("slider.process(this)");
				}else if(did.indexOf("content")!=-1){
					array.push(did.replace('-content','')); d.maxh=d.offsetHeight;
					if(c!=y){d.style.height='0px'; d.style.display='none'}
					else{d.style.display='block'}
				} 
			}
		},
		process:function(d){
			var cl,i; cl=array.length; i=0;
			for(i;i<cl;i++){
				var s,h,c,cd;
				s=array[i]; h=document.getElementById(s+'-header');
				c=s+'-content'; cd=document.getElementById(c); clearInterval(cd.timer);
				if(h==d&&cd.style.display=='none'){
					cd.style.display='block'; this.islide(c,1);
				}else if(cd.style.display=='block'){this.islide(c,-1)}
			}
		},
		islide:function(i,d){var c,m; c=document.getElementById(i); m=c.maxh; c.direction=d; c.timer=setInterval("slider.slide('"+i +"')",timer)},
		slide:function(i){
			var c,m,h,dist; c=document.getElementById(i); m=c.maxh; h=c.offsetHeight;
			dist=(c.direction==1)?Math.round((m-h)/speed):Math.round(h/speed);
			if(dist<=1){dist=1}
			c.style.height=h+(dist*c.direction)+'px'; c.style.opacity=h/c.maxh; c.style.filter='alpha(opacity='+(h*100/c.maxh)+')';
			if(h<2&&c.direction!=1){
				c.style.display='none'; clearInterval(c.timer);
			}else if(h>(m-2)&&c.direction==1){clearInterval(c.timer)}
		}
};}();