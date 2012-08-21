/**************************
*
*	ZoomCanvas v 0.1
*	(c) Doug McKay - http://dougmckay.com
*	License: MIT (http://www.opensource.org/licenses/mit-license.php)
*
**************************/

var ZoomCanvas = function(){
	var _debug = false, _element,_height,_width,_maxZoom,_images, _ctx, _currentZoom = 0;
	var _bgimage = new Image();
	
	function setWidth(){
		_element.width = _width;
		_element.height = _height;
	}
	
	function zoomIn(){
		_currentZoom++;
		if( _currentZoom >= (_images.length-1) ) _currentZoom=(_images.length-1);
		updateZoom();
	}
	
	function zoomOut(){
		_currentZoom--;
		if(_currentZoom < 0) { _currentZoom = 0; }
		updateZoom();
	}
	function updateZoom(){
		_bgimage.src = _images[_currentZoom].img;
		updateView(0,0);
	}
	function clearView(){
		// Store the current transformation matrix
		_ctx.save();
		
		// Use the identity matrix while clearing the canvas
		_ctx.setTransform(1, 0, 0, 1, 0, 0);
		_ctx.clearRect(0, 0, _element.width, _element.height);
		
		// Restore the transform
		_ctx.restore();
	}
	function updateView(coords){
		_ctx.drawImage(_bgimage, -(coords.x*_currentZoom), -(coords.y*_currentZoom), _bgimage.width, _bgimage.height);
	}
	
	function clickZoom(event){
		var x = new Number();
        var y = new Number();
        
        if (event.x != undefined && event.y != undefined)
        {
          x = event.x;
          y = event.y;
        }
        else // Firefox method to get the position
        {
          x = event.clientX + document.body.scrollLeft +
              document.documentElement.scrollLeft;
          y = event.clientY + document.body.scrollTop +
              document.documentElement.scrollTop;
        }

        x -= _element.offsetLeft;
        y -= _element.offsetTop;
		var coords = {x: x, y:  y};
		
		if(_debug){
			// setup the line style
			_ctx.strokeStyle = 'rgba(200,0,0,.4)';
			_ctx.lineWidth = 2;
			_ctx.lineCap = 'round';
			
			
			_ctx.moveTo(coords.x, coords.y);
			_ctx.beginPath();
			// draw the arc path
			// (I'll walk you through these values momentarily - bear with me!)
			_ctx.arc(coords.x, coords.y, 20, 0, Math.PI*2, false);
			// colour the path
			_ctx.stroke();
	
		}
		//clearView();
		//updateView(coords);
	}
	return {
		debug : function(debug){
			_debug = debug;
			if(_debug){
				
			};
		},
		create : function(data){
			_element	= data.element;
			_height		= data.height;
			_width		= data.width;
			_currentZoom	= data.currentZoom;
			_images 	= data.images;
			_maxZoom	= _images.length;
			
			_ctx = _element.getContext('2d');
			
			/* SETUP IMAGE LOAD */
			_bgimage.onload = function(){
				_ctx.drawImage(_bgimage, 0, 0, _bgimage.width, _bgimage.height);
			}
			
			_element.addEventListener("mousedown", clickZoom, false);
			
			setWidth();
			updateZoom();
			updateView( {x:0, y: 0} );
			
		},
		zoomIn : function(){
			zoomIn();
		},
		zoomOut : function(){
			zoomOut();
		}
	}
};