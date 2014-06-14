import json
import math

from IPython.core.displaypub import publish_display_data

class Turtle:
    SIZE = 400
    OFFSET = 20
    REGISTERED = 0
    def __init__(self):
        '''Create a Turtle.
        Turtle()
        Example: t = Turtle()'''    
        self.pen = 1
        self.speedVar = 1
        self.color = "black"
        self.points = []
        self.home()
        if(not Turtle.REGISTERED):
            get_ipython().events.register('post_run_cell', self.postExecuteTurtle)

    def postExecuteTurtle(self):
        jp = 'IPython.do_turtle(%s, element);' % json.dumps(self.points)
        publish_display_data(source="NewTurtle",
             data={'application/javascript': jp})
        self.points = []
        Turtle.REGISTERED = 1

    def pendown(self):
        '''Put down the pen. This is the default.
        pendown()
        Example: t.pendown()'''
        self.pen = 1

    def penup(self):
        '''Lift up the pen.
        penup()
        Example: t.penup()'''
        self.pen = 0

    def speed(self, speed):
        '''Change the speed of the turtle
        speed(speed)
        Example: t.speed(speed)'''
        self.speedVar=speed%11

    def right(self, num):
        '''Turn the Turtle num degrees to the right.
        right(num)
        Example: t.right(90)'''
        self.bearing -= num
        self.bearing = self.bearing%360
        self.b_change = num   
        self._add_point()

    def left(self, num):
        '''Turn the Turtle num degrees to the left.
        left(num)
        Example: t.left(90)'''
        self.bearing += num
        self.bearing = self.bearing%360
        self.b_change = (-1)*num
        self._add_point()

    def forward(self, num):
        '''Move the Turtle forward by num units.
        forward(num)
        Example: t.forward(100)'''
        '[1, "simple", "list"]'

        self.posX += round(num * math.cos(math.radians(self.bearing)), 1)
        self.posY -= round(num * math.sin(math.radians(self.bearing)), 1)


        if self.posX < Turtle.OFFSET:
            self.posX = Turtle.OFFSET
        if self.posY < Turtle.OFFSET:
            self.posY = Turtle.OFFSET

        if self.posX > Turtle.SIZE - Turtle.OFFSET:
            self.posX = Turtle.SIZE - Turtle.OFFSET
        if self.posY > Turtle.SIZE - Turtle.OFFSET:
            self.posY = Turtle.SIZE - Turtle.OFFSET

        self.b_change = 0
        self._add_point()

    def backward(self, num):
        '''Move the Turtle backward by num units.
        backward(num)
        Example: t.backward(100)'''
        self.posX -= round(num * math.cos(math.radians(self.bearing)), 1)
        self.posY += round(num * math.sin(math.radians(self.bearing)), 1)

        if self.posX < Turtle.OFFSET:
            self.posX = Turtle.OFFSET
        if self.posY < Turtle.OFFSET:
            self.posY = Turtle.OFFSET

        if self.posX > Turtle.SIZE - Turtle.OFFSET:
            self.posX = Turtle.SIZE - Turtle.OFFSET
        if self.posY > Turtle.SIZE - Turtle.OFFSET:
            self.posY = Turtle.SIZE - Turtle.OFFSET

        self.b_change = 0
        self._add_point()

    def pencolor(self, color):
        '''Change the color of the pen to color. Default is black.
        pencolor(color)
        Example: t.pencolor("red")'''
        self.color = color

    def _add_point(self):
        self.points.append(dict(p=self.pen, lc=self.color, x=self.posX, y=self.posY, b=self.b_change, s=self.speedVar))

    def circle(self, radius, extent=360):
        temp = self.bearing
        self.b_change = 0;
        tempSpeed = self.speedVar
        self.speedVar = 1
        
        for i in range(0, (extent//2)):
            n = math.fabs(math.radians(self.b_change) * radius)
            if(radius >= 0):
                self.forward(n);
                self.left(2);
            else:
                self.forward(n);
                self.right(2);
        if(radius >= 0):
            self.bearing = (temp + extent)
        else:
            self.bearing = (temp - extent)
        self.speedVar = tempSpeed

    def home(self):
        '''Move the Turtle to its home position.
        home()
        Example: t.home()'''
        self.posX = 200
        self.posY = 200
        self.bearing = 0
        self.b_change = 0
        self._add_point()
