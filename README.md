# Routekeeper : Plan and save your walking routes through your city! 

## Motivation

I wanted to learn more about :

1. [node.js](http://nodejs.org) (the web server framework written in Javascript)
1. [Google Maps API](http://code.google.com/apis/maps/documentation/geocoding/#ReverseGeocoding)
1. [jQuery](http://api.jquery.com/)
1. [JSON](http://json.org/)

node.js is really cool - it is a great way to apply functional
programming ideas to writing long-running server-based software (i.e. daemons). It's:

* fast: 'nodejs' is a native executable that leverages Google's V8 Javascript libraries (same used in Google Chrome).
* scalable: no while(1) loop, no thread pool or set limit on number of threads
* flexible: Easy to extend with callbacks.
* concise: Don't Repeat Yourself (DRY) very easy to accomplish due to use of the functional features of Javascript (e.g. function-passing): very easy to factor out repetitive code.

# Future work

## Backend/technical perspective

1. [PostgreSQL integration with node.js](http://github.com/ry/node_postgres)
2. Geometry stuff like intersections, drawing (walking) paths between points
3. Dom listeners : how one node's update can trigger another AJAX actions.

## User perspective

1. Saving and sharing routes 
1. Showing intersections between routes
1. Wikipedia integration (finding points of interest in Wikipdia using
Lat/Long coords)

