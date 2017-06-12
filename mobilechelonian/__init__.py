import os.path
import math

from ipywidgets import widgets
from notebook import nbextensions
from traitlets import Unicode, List
from IPython.display import display

__version__ = '0.4'

def install_js():
    pkgdir = os.path.dirname(__file__)
    nbextensions.install_nbextension(os.path.join(pkgdir, 'mobilechelonianjs'),
                                     user=True)

class Turtle(widgets.DOMWidget):
    _view_module = Unicode("nbextensions/mobilechelonianjs/turtlewidget").tag(sync=True)
    _view_name = Unicode('TurtleView').tag(sync=True)
    # TODO: Make this an eventful list, so we're not transferring the whole
    # thing on every sync
    points = List(sync=True)

    SIZE = 400
    OFFSET = 20
    def __init__(self):
        '''Create a Turtle.
        
        Example::
        
            t = Turtle()
        '''
        super(Turtle, self).__init__()
        install_js()
        display(self)
        self.pen = 1
        self.speedVar = 1
        self.color = "black"
        self.bearing = 90
        self.points = []
        self.home()

    def pendown(self):
        '''Put down the pen. Turtles start with their pen down.

        Example::
        
            t.pendown()
        '''
        self.pen = 1

    def penup(self):
        '''Lift up the pen.

        Example::
        
            t.penup()
        '''
        self.pen = 0

    def speed(self, speed):
        '''Change the speed of the turtle (range 1-10).

        Example::
        
            t.speed(10) # Full speed
        '''
        self.speedVar = min(max(1, speed), 10)

    def right(self, num):
        '''Turn the Turtle num degrees to the right.

        Example::
        
            t.right(90)
        '''
        self.bearing += num
        self.bearing = self.bearing%360
        self.b_change = num   
        self._add_point()

    def left(self, num):
        '''Turn the Turtle num degrees to the left.

        Example::
        
            t.left(90)
        '''
        self.bearing -= num
        self.bearing = self.bearing%360
        self.b_change = -num
        self._add_point()

    def forward(self, num):
        '''Move the Turtle forward by num units.

        Example:
        
            t.forward(100)
        '''
        self.posX += round(num * math.sin(math.radians(self.bearing)), 1)
        self.posY -= round(num * math.cos(math.radians(self.bearing)), 1)

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

        Example::
        
            t.backward(100)
        '''
        self.posX -= round(num * math.sin(math.radians(self.bearing)), 1)
        self.posY += round(num * math.cos(math.radians(self.bearing)), 1)

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

        Example::
        
            t.pencolor("red")
        '''
        self.color = color

    def _add_point(self):
        p = dict(p=self.pen, lc=self.color, x=self.posX, y=self.posY, b=self.b_change, s=self.speedVar)
        self.points = self.points + [p]

    def circle(self, radius, extent=360):
        """Draw a circle, or part of a circle.
        
        From its current position, the turtle will draw a series of short lines,
        turning slightly between each. If radius is positive, it will turn to
        its left; a negative radius will make it turn to its right.
        
        Example::
        
            t.circle(50)
        """
        temp = self.bearing
        self.b_change = 0;
        tempSpeed = self.speedVar
        self.speedVar = 1
        
        for i in range(0, (extent//2)):
            n = math.fabs(math.radians(self.b_change) * radius)
            if(radius >= 0):
                self.forward(n)
                self.left(2)
            else:
                self.forward(n)
                self.right(2)
        if(radius >= 0):
            self.bearing = (temp + extent)
        else:
            self.bearing = (temp - extent)
        self.speedVar = tempSpeed

    def home(self):
        '''Move the Turtle to its home position.

        Example::
        
            t.home()
        '''
        self.posX = 200
        self.posY = 200
        if 90 < self.bearing <=270:
            self.b_change = - (self.bearing - 90)
        else:
            self.b_change = 90 - self.bearing
        self.bearing = 90
        self._add_point()
