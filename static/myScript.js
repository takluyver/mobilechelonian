/*
  myScript.js handles turtle animation using the canvas tool and the paper.js script
*/

define( function () {

function do_turtle(data, element) {
        var toinsert = $('<div/>');
        var turtleArea = $('<div/>');
        turtleArea.attr('id','turtle-canvas-area');
        toinsert.append(turtleArea);

        var buttonDiv = $('<div\>');
        buttonDiv.attr('target','button-area');

        // create help button 
        var helpButton = $('<button\>');
        helpButton.append("Help!");
        buttonDiv.append(helpButton);
        
        // create grid button  
        var gridButton = $('<button\>');
        gridButton.attr('id','grid-element');
        gridButton.attr('value', 0);
        gridButton.append("Grid On/Off");
        buttonDiv.append(gridButton);
        toinsert.append(buttonDiv);

        var canvasDiv = $('<div/>');
        toinsert.append(canvasDiv);
        
        var canvas = document.createElement('canvas');
        canvas.id     = "canvas1";
        canvas.width  = 401;
        canvas.height = 401;
        canvas.resize;

        canvasDiv.append(canvas);
        
        toinsert.turtledrawing = new TurtleDrawing(data, canvas, gridButton, helpButton);
        toinsert.turtledrawing.draw_turtle();
        toinsert.turtledrawing.set_frame_handler();
        
        element.append(toinsert);
}

function load_ipython_extension() {
    IPython.do_turtle = do_turtle;
    console.log("Attached to IPython");
}

function TurtleDrawing(data, canvas_element, grid_button, help_button) {
    this.data = data;
    this.canvas = canvas_element;
    this.canvas.style.background = '#99CCFF';
    paper.setup(this.canvas);
    
    /* adds grid for user to turn off / on, helps see what the turtle is doing */
    this.grid = new paper.Path();
    this.grid_on = false;
    this.grid_button = grid_button;
    var that = this;
    this.grid_button.click(function (){
        var grid = that.grid;
        if (!that.grid_on) {
            that.grid_on = true;
            grid.strokeColor = 'grey';
            var start = new paper.Point(1,1);
            grid.moveTo(start);
            var canvasSize = that.canvas.width;
            grid.lineTo(start.add([0,canvasSize]));
            
            for(var i = 20; i <= canvasSize; i += 20){
                grid.lineTo(start.add([i,canvasSize]));
                grid.lineTo(start.add([i,0]));
                grid.lineTo(start.add([i+20,0]));
            }
            for(var i = 20; i <= canvasSize; i += 20){
                grid.lineTo(start.add([canvasSize,i]));
                grid.lineTo(start.add([0,i]));
                grid.lineTo(start.add([0,i+20]));
            }
            paper.view.draw();
        } else {
            that.grid_on = false;;
            grid.clear();
            paper.view.draw();
        }
    });
    
    this.help_button = help_button;
    this.help_button.click(function (event){
        alert("example:\nfrom NewTurtle import Turtle\nt = Turtle()\nt.forward(50)\nfor help:\nhelp(Turtle)");
    });

    /*
      getValue splits up the string with any turtle infromation, breaks it up 
      into points which have an x, y and b value. It is called 6 times for every turtle command entered (once for each new and old point value). Count is itterated for 
      turtle command entered. The count argument should tell the function which turtle 
      command you want information about, the coord argument should specify which or the 6 possible pieces of information about each command you're looking for.
    */
    TurtleDrawing.prototype.getValue = function (count,coord){

        var p;
        var lc;
        var x;
        var y;
        var s;

        var wCoord = this.coord;
        var points = [{p:1, lc:"black", x:200, y:200, b:0, s:1}];
        var wCount = this.count;
        
        var d = this.data;
        for(i = 0; i < d.length ; i+=6){
            p = parseInt(d[i]);
            
            lc = d[i+1];
            x = parseFloat(d[i+2]);
            y = parseFloat(d[i+3]);
            b = parseInt(d[i+4]);
            s = parseInt(d[i+5]);
            
            points.push ({p:p, lc:lc, x:x, y:y, b:b, s:s});	
        }
        
        if(coord == 1){
            return oldPen = points[wCount].p;
        }
        else if(coord == 2){
            return oldColour = points[wCount].lc;
        }   
        else if(coord == 3){
            return oldX = points[wCount].x;
        }
        else if(coord == 4){
            return 	oldY = points[wCount].y;
        }
        else if(coord == 5){
            return 	oldRotation = points[wCount].b;
        }
        else if(coord == 6){
            return 	turtleSpeed = points[wCount].s;
        }
        else if(coord == 7){
            return newPen = points[wCount+1].p;
        }
        else if(coord == 8){
            return newColour = points[wCount+1].lc;
        }
        else if(coord == 9){
            return 	newX = points[wCount+1].x;
        }
        else if(coord == 10){
            return 	newY = points[wCount+1].y;
        }
        else if(coord == 11){
            return 	newRotation = points[wCount+1].b;
        }
        else if(coord == 12){
            return turtleSpeed = points[wCount+1].s;
        }
    }
    
    // some variable to play with still
    this.lineSize = 2;
    this.rotateSpeed = 1;
    this.turtleColour ='#006900' ;
    this.turtleShow = 1;
    
    // onFrame variables
    this.oldPen=1;
    this.oldX = 200;
    this.oldY = 200;
    this.oldRotation=0;
    this.oldColour="black";
    this.newPen=1;
    this.newX=200; 
    this.newY=200;
    this.newRotation=0;
    this.newColour="black";
    this.veryOldX = 200;
    this.veryOldY = 200;
    this.turtleSpeed = 1;

    // counts each turtle command
    this.count = 0;
    this.changRot = 0;
    
    this.path = new paper.Path();
    this.path.strokewidth = 3;
    this.path.add(new paper.Point(this.veryOldX, this.veryOldY));
    
    /* 
       nextCount is the first function to run for each turtle command. It sets the 
       global variables to each of the values pulled from the intial string.
    */
    TurtleDrawing.prototype.nextCount = function (){
        var count = this.count;
        this.oldPen = this.getValue(count, 1);
        this.oldColour = this.getValue(count, 2);
        this.oldX = this.getValue(count,3);
        this.oldY = this.getValue(count,4);
        this.oldRotation = this.getValue(count,5);
        this.turtleSpeed = this.getValue(count,6);
        this.newPen = this.getValue(count, 7);
        this.newColour = this.getValue(count, 8);
        this.newX = this.getValue(count,9);
        this.newY = this.getValue(count,10);
        this.changRot = this.getValue(count,11);
        this.turtleSpeed = this.getValue(count,12);
        this.count++;
        this.veryOldX = this.oldX;
        this.veryOldY = this.oldY;
        //path.add(new paper.Point(veryOldX, veryOldY));

        var path = this.path;
        if(newPen!=oldPen || newColour != oldColour){
            path = new paper.Path();
            path.strokeWidth = 3;
            
            path.add(new paper.Point(oldX, oldY));
        }

        // Good test command to see what the input is from the string
       //alert("old:"+oldX +" "+ oldY + " " + oldRotation + " New:" + newX + " " +newY + " " + changRot+ " " +turtleSpeed );

    }
    
    TurtleDrawing.prototype.draw_turtle = function() {
        //builds the initial turtle icon
        //~ if(this.turtleShow==1){
            var oldX = this.oldX;
            var oldY = this.oldY;
            var turtleColour = this.turtleColour;

            var tail = new paper.Path.RegularPolygon(new paper.Point(oldX-11,oldY), 3, 3);
            tail.rotate(30);
            tail.fillColor = turtleColour;

            var circlePoint = new paper.Point(oldX, oldY);

            var circle1 = new paper.Path.Circle(circlePoint, 10);
            circle1.fillColor = turtleColour;

            var circlePoint = new paper.Point(oldX+7, oldY-10);

            var circle2 = new paper.Path.Circle(circlePoint, 3);
            circle2.fillColor = turtleColour;

            var circlePoint = new paper.Point(oldX-7, oldY+10);

            var circle3 = new paper.Path.Circle(circlePoint, 3);
            circle3.fillColor = turtleColour;

            var circlePoint = new paper.Point(oldX+7, oldY+10);

            var circle4 = new paper.Path.Circle(circlePoint, 3);
            circle4.fillColor = turtleColour;

            var circlePoint = new paper.Point(oldX-7, oldY-10);

            var circle5 = new paper.Path.Circle(circlePoint, 3);
            circle5.fillColor = turtleColour;

            var circlePoint = new paper.Point(oldX+10, oldY);

            var circle6 = new paper.Path.Circle(circlePoint, 5);
            circle6.fillColor = turtleColour;

            this.turtle = new paper.Group([circle1,circle2,circle3,circle4,circle5,circle6,tail]);
            paper.view.draw;
        //~ }
    }
    
    /*
      The onFrame function does all the drawing, its called every frame at roughly
      30-60fps
    */
    TurtleDrawing.prototype.set_frame_handler = function () {
        var that = this;
        
    paper.view.onFrame = function(event) {
        var turtleSpeed = that.turtleSpeed;
        var changRot = that.changRot;
        var turtleShow = that.turtleShow;

        var changX =Math.abs(that.oldX-that.newX);
        var changY =Math.abs(that.oldY-that.newY);

        // the frame variables outline how much in which direction, this allows
        // the turtle to take the shortest route
        var frameX;
        var frameY;

        if ((changY ==0 || changX ==0)){
            // can't devide by 0, no need for frame calculation anyway if there's 
            // no change in one direction
            frameY = 1;
            frameX = 1;
        } else if (changX < changY) {
            // make ratio for Y
            frameX = (changX/changY);
            frameY = 1;
        } else {
            // make ratio for X
            frameY = (changY/changX);
            frameX = 1;	
        }
        //alert("changX: " + changX + " chanY: " + changY )
        if((changX<turtleSpeed) && that.changRot==0 && changX!=0){
            
            if ((changX<=2) && changRot==0 && changX!=0){
                that.oldX=that.newX;
                that.oldY=that.newY;
            }
            //if (((Math.abs(oldX-newX))<=(turtleSpeed/2)) && changRot==0 && changX!=0){
            //	turtleSpeed=(Math.abs(oldX-newX));
            //}
            turtleSpeed = changX;
        }

        if ((changY<turtleSpeed) && that.changRot==0 && changY!=0){
            
            if ((changY<=2) && that.changRot==0 && changY!=0){
                that.oldX = that.newX;
                that.oldY = that.newY;
            }
            //if (((Math.abs(oldY-newY))<=(turtleSpeed/2)) && changRot==0 && changY!=0){
            //	turtleSpeed=(Math.abs(oldX-newX));
            //}
            turtleSpeed = changY;
        
        }
        
        //if( changX<changY && (Math.abs(oldY-newY)-10)<turtleSpeed ){
        //	turtleSpeed=1;
            
        //}
        
        else if  (that.changRot!=0 && (Math.abs(changRot))<turtleSpeed){
            turtleSpeed=1;
            
        }
        //frameX *= turtleSpeed;
        //frameY *= turtleSpeed;

        //rotate turtle, current is the exact centre of the turtle
        if (changRot != 0 && that.turtleShow==1){
            var current = new paper.Point(oldX, oldY);
            
            if(changRot < 0){
            
                that.changRot += that.rotateSpeed*turtleSpeed;
                that.turtle.rotate(-that.rotateSpeed*turtleSpeed,current);

            }
            if(changRot > 0){

            that.changRot -= that.rotateSpeed*turtleSpeed;
            that.turtle.rotate(that.rotateSpeed*turtleSpeed,current);		
            
            }
        } else {
            //if turtle is off we have to manually set old rotation	
            that.oldRotation = that.newRotation;
        }

        if (that.newX > that.oldX) {
            that.oldX += (frameX*turtleSpeed);
            if(turtleShow==1){
                that.turtle.translate((frameX*turtleSpeed),0);
            }
        }
        if (that.newY > that.oldY){
            that.oldY += (frameY*turtleSpeed);
            if(turtleShow==1){
                that.turtle.translate(0,(frameY*turtleSpeed));
            }
        }

        if (that.newX < that.oldX){
            that.oldX -= (frameX*turtleSpeed);
            if(turtleShow==1){
                that.turtle.translate((-frameX*turtleSpeed),0);
            }
        }

        if (that.newY < that.oldY){
            that.oldY -= (frameY*turtleSpeed);
            if(turtleShow==1){
                that.turtle.translate(0,(-frameY*turtleSpeed));
            }
        }
        
        // prints the little circles every frame until we reach the correct point
        // to create the line
        //alert(" ("+ newY+ ")  "+ oldY+ "  where brooklyn at " +" ("+ newX+ ")  "+ oldX + " speed:"+ turtleSpeed + " changRot:" + changRot);
        if (that.newY != that.oldY || that.newX != that.oldX || that.changRot != 0){
            
            if(that.newPen == 1){
                that.path.add(new paper.Point(that.oldX, that.oldY));
                that.turtle.position = new paper.Point(that.oldX, that.oldY);
                that.path.strokeColor = newColour;
            }
        } else {
            // done animating this command
            that.path.add(new paper.Point(that.newX, that.newY));
            that.nextCount();
        }
    }
    }
}


return {
        load_ipython_extension : load_ipython_extension,
    };
    
});
