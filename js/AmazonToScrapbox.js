 javascript:(function(){
    var p = document.getElementById("productTitle");
    if (!p) var p = document.getElementById("ebooksProductTitle");
    var d = document.getElementById("productDescription");
    if (!d)  {
    	var subdoc = document.getElementById("product-description-iframe").contentWindow.document;
    	var d = subdoc.getElementById("productDescription");
    }
    var d1 = d.getElementsByTagName("p")[0];
    if (!d1) var d1 = d.getElementsByClassName("productDescriptionWrapper")[0];
    var d2 = d1.innerText.replace(/\n/g,'\n>');
    var title=window.prompt('Scrap "Amazon" to your scrapbox.', p.innerHTML);
    if (!title) return;
    title = '『'+ title +'』';
    var imagecontainer=document.getElementById("imageBlockContainer");
    if (!imagecontainer) var imagecontainer = document.getElementById("ebooksImageBlockContainer");
    let image = imagecontainer.getElementsByTagName("img")[0];
    let imageurl = image.getAttribute("src");
    let pub = [];
  	var c = document.getElementsByClassName('author');
  	for (g = 0; g < c.length ;g++){
  		var at = c[g].innerText.replace(/,/,'');
  		var pu = at.match(/\(.+\)/);
  		var ct = at.replace(/\(.+\)/,'').replace(/ /g,'');
  		pub.push(pu + ' [' + ct + ']');
  	}
  	var lines='['+imageurl+' '+window.location.href+']\n'  + pub.join(' ') + '\n>' + d2 + '\n#本';  
    var body=encodeURIComponent(lines);
    window.open('https://scrapbox.io/noratetsuobj/'+encodeURIComponent(title.trim())+'?body='+body)
 })();
 
