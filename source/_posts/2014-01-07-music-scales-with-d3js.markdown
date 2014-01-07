---
layout: post
title: "Music Scales with d3.js"
date: 2014-01-07 22:02:19 +0100
comments: true
categories: [ music, d3js ]
---

This post is a small example that uses [d3.js](http://d3js.org/) to dynamically shows different music scales. 

<!--more-->

The following buttons allow you to switch from a music scale to the other and to rotate the notes.

<link rel="stylesheet" type="text/css" href="{{ root_url }}/resources/2014-01-07-music-scales-with-d3js/style.css">
<script src="http://d3js.org/d3.v3.min.js"></script>

<div id="d3js">
	<button id="chromatic">chromatic scale</button>
	<button id="major">major scale</button>
	<button id="naturalMinor">natural minor scale</button>
	<button id="harmonicMinor">harmonic minor scale</button>
	<button id="rotate">rotate</button>
</div>

<script type="text/javascript" src="{{ root_url }}/resources/2014-01-07-music-scales-with-d3js/scales.js"></script>

## Some words about the implementation

The javascript is mainly inspired by the [Donut Chart](http://bl.ocks.org/mbostock/3887193) example.

The graphics is composed of 12 SVG groups; one per note. Each SVG group is composed of an arc and a text.

[Ordinals](https://github.com/mbostock/d3/wiki/Ordinal-Scales) are used to store data:

* one containing the [colors](https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-category20) that are used to fill the arcs
* one containing the notes that are used to set the text contents
{% codeblock lang:javascript Notes %}
var notes = d3.scale.ordinal().range([ "A", "A#/Bb", "B", "C", "C#/Db", "D", "E#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab" ]);
{% endcodeblock %}
* one for each music scale; they are used to change the opacity of each SVG group
{% codeblock lang:javascript The Major Scale %}
var major = d3.scale.ordinal().range([1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]);
{% endcodeblock %}


When the reset button is clicked, an offset is incremented and the color and the text of each SVG group are changed:

{% codeblock lang:javascript Rotate button listener %}
d3.select("#rotate").on("click", function() {
    offset++;
    d3.selectAll(".note > path")
        .transition()
        .style("fill", function(d, i) {
            return color(i + offset);
        });

    d3.selectAll(".note > text")
        .transition()
        .text(function(d, i) {
            return notes(i + offset);
    });
});
{% endcodeblock %}


When one of the scale button is clicked, the opacity of each SVG group is changed based on the ordinal of the selected scale.

{% codeblock lang:javascript Major Scale button listener %}
d3.select("#major").on("click", function() {
	d3.selectAll(".note")
	.transition()
	.style("opacity", function(d, i) {
		return major(i);
	});
});
{% endcodeblock %}


