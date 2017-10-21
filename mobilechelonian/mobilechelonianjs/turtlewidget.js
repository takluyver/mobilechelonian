define(['nbextensions/mobilechelonianjs/paper', "@jupyter-widgets/base"], function(paperlib, widget){
    
    function TurtleDrawing(canvas_element, grid_button, help_button) {
        this.points = [];
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
                
                var i;
                for(i = 20; i <= canvasSize; i += 20){
                    grid.lineTo(start.add([i,canvasSize]));
                    grid.lineTo(start.add([i,0]));
                    grid.lineTo(start.add([i+20,0]));
                }
                for(i = 20; i <= canvasSize; i += 20){
                    grid.lineTo(start.add([canvasSize,i]));
                    grid.lineTo(start.add([0,i]));
                    grid.lineTo(start.add([0,i+20]));
                }
                paper.view.draw();
            } else {
                that.grid_on = false;
                grid.clear();
                paper.view.draw();
            }
        });
        
        this.help_button = help_button;
        this.help_button.click(function (event){
            alert("example:\nfrom NewTurtle import Turtle\nt = Turtle()\nt.forward(50)\nfor help:\nhelp(Turtle)");
        });
        
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
        this.path.strokeWidth = 3;
        this.path.add(new paper.Point(this.veryOldX, this.veryOldY));
        
        /* 
           nextCount is the first function to run for each turtle command. It sets the 
           global variables to each of the values pulled from the intial string.
        */
        TurtleDrawing.prototype.nextCount = function (){
            var count = this.count;
            if (count+1 >= this.points.length) {
                return;
            }
            this.oldPen = this.points[count].p;
            this.oldColour = this.points[count].lc;
            this.oldX = this.points[count].x;
            this.oldY = this.points[count].y;
            this.oldRotation = this.points[count].b;
            this.turtleSpeed = this.points[count].s;
            this.newPen = this.points[count+1].p;
            this.newColour = this.points[count+1].lc;
            this.newX = this.points[count+1].x;
            this.newY = this.points[count+1].y;
            this.changRot = this.points[count+1].b;
            this.turtleSpeed = this.points[count+1].s;
            this.count++;
            this.veryOldX = this.oldX;
            this.veryOldY = this.oldY;
            //path.add(new paper.Point(veryOldX, veryOldY));

            if (this.newPen != this.oldPen || this.newColour != this.oldColour){
                //Changing pen - start a new path
                this.path = new paper.Path();
                this.path.strokeWidth = 3;
                this.path.add(new paper.Point(this.oldX, this.oldY));
            }

            // Good test command to see what the input is from the string
           //alert("old:"+oldX +" "+ oldY + " " + oldRotation + " New:" + newX + " " +newY + " " + changRot+ " " +turtleSpeed );

        };
        
        TurtleDrawing.prototype.draw_turtle = function() {
            //builds the initial turtle icon
            if(this.turtleShow===1){
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
            }
        };
        this.draw_turtle();
        
        /*
          The onFrame function does all the drawing, its called every frame at roughly
          30-60fps
        */
        var that = this;
            
        paper.view.on('frame', function(event) {
            var turtleSpeed = that.turtleSpeed;
            var changRot = that.changRot;
            var turtleShow = that.turtleShow;

            var changX =Math.abs(that.oldX-that.newX);
            var changY =Math.abs(that.oldY-that.newY);

            // the frame variables outline how much in which direction, this allows
            // the turtle to take the shortest route
            var frameX;
            var frameY;

            if ((changY === 0 || changX === 0)){
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
            if((changX<turtleSpeed) && that.changRot===0 && changX!==0){
                
                if ((changX<=2) && changRot===0 && changX!==0){
                    that.oldX=that.newX;
                    that.oldY=that.newY;
                }
                //if (((Math.abs(oldX-newX))<=(turtleSpeed/2)) && changRot==0 && changX!=0){
                //	turtleSpeed=(Math.abs(oldX-newX));
                //}
                turtleSpeed = changX;
            }

            if ((changY<turtleSpeed) && that.changRot===0 && changY!==0){
                
                if ((changY<=2) && that.changRot===0 && changY!==0){
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
            
            else if  (that.changRot!==0 && (Math.abs(changRot))<turtleSpeed){
                turtleSpeed=1;
                
            }
            //frameX *= turtleSpeed;
            //frameY *= turtleSpeed;

            //rotate turtle, current is the exact centre of the turtle
            if (changRot !== 0 && that.turtleShow===1){
                var current = new paper.Point(that.oldX, that.oldY);
                
                if(changRot < 0) {
                    // Turning left
                    that.changRot += that.rotateSpeed*turtleSpeed;
                    that.turtle.rotate(-that.rotateSpeed*turtleSpeed,current);
                } else {
                    // Turning right
                    that.changRot -= that.rotateSpeed*turtleSpeed;
                    that.turtle.rotate(that.rotateSpeed*turtleSpeed,current);                
                }
            } else {
                //if turtle is off we have to manually set old rotation	
                that.oldRotation = that.newRotation;
            }

            if (that.newX > that.oldX) {
                that.oldX += (frameX*turtleSpeed);
                if(turtleShow===1){
                    that.turtle.translate((frameX*turtleSpeed),0);
                }
            }
            if (that.newY > that.oldY){
                that.oldY += (frameY*turtleSpeed);
                if(turtleShow===1){
                    that.turtle.translate(0,(frameY*turtleSpeed));
                }
            }

            if (that.newX < that.oldX){
                that.oldX -= (frameX*turtleSpeed);
                if(turtleShow===1){
                    that.turtle.translate((-frameX*turtleSpeed),0);
                }
            }

            if (that.newY < that.oldY){
                that.oldY -= (frameY*turtleSpeed);
                if(turtleShow===1){
                    that.turtle.translate(0,(-frameY*turtleSpeed));
                }
            }
            
            // prints the little circles every frame until we reach the correct point
            // to create the line
            //alert(" ("+ newY+ ")  "+ oldY+ "  where brooklyn at " +" ("+ newX+ ")  "+ oldX + " speed:"+ turtleSpeed + " changRot:" + changRot);
            if (that.newY !== that.oldY || that.newX !== that.oldX || that.changRot !== 0){
                
                if(that.newPen == 1){
                    that.path.add(new paper.Point(that.oldX, that.oldY));
                    that.turtle.position = new paper.Point(that.oldX, that.oldY);
                    that.path.strokeColor = that.newColour;
                }
            } else {
                // done animating this command
                that.path.add(new paper.Point(that.newX, that.newY));
                that.nextCount();
            }
        });
    }
    
    // Define the DatePickerView
    var TurtleView = widget.DOMWidgetView.extend({
        render: function(){
            var toinsert = $('<div/>');
            var turtleArea = $('<div/>');
            turtleArea.attr('id','turtle-canvas-area');
            toinsert.append(turtleArea);

            var buttonDiv = $('<div/>');
            buttonDiv.attr('target','button-area');

            // create help button 
            var helpButton = $('<button/>');
            helpButton.append("Help!");
            buttonDiv.append(helpButton);
            
            // create grid button  
            var gridButton = $('<button/>');
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
            
            this.turtledrawing = new TurtleDrawing(canvas, gridButton, helpButton);
            this.turtledrawing.points = this.model.get('points');
            
            this.$el.append(toinsert);
            window.debugturtle = this;
        },
        update: function(options) {
            //console.log("doing update");
            this.turtledrawing.points = this.model.get('points');
        }
    });

    return {TurtleView: TurtleView};
});
