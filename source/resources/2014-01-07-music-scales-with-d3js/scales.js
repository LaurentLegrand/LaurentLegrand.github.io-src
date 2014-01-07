var offset = 0;

var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal().range(d3.scale.category20().range().slice(0, 12));

var notes = d3.scale.ordinal().range(["A", "A#/Bb", "B", "C", "C#/Db", "D", "E#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab" ]);

var major = d3.scale.ordinal().range([1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]);
var naturalMinor = d3.scale.ordinal().range([1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0]);
var harmonicMinor = d3.scale.ordinal().range([1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70)
    .startAngle(function(d, i) { return (i -0.5 - offset) * Math.PI / 6; })
    .endAngle(function(d, i) { return (i + 0.5 - offset) * Math.PI / 6; });


var svg = d3.select("#d3js").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var g = svg.selectAll(".note")
    .data(notes.range())
    .enter().append("g")
        .attr("class", "note");

g.append("path")
    .attr("d", arc)
    .style("fill", function(d, i) { return color((i + offset) % 12); });

g.append("text")
    .attr("transform", function(d, i) {
	    return "translate(" + arc.centroid(d, i) + ")"; })
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .style("z-index", 10)
    .text(function(d, i) { return notes(i); });

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

d3.select("#major").on("click", function() {
	d3.selectAll(".note")
	.transition()
	.style("opacity", function(d, i) {
		return major(i);
	});
});
d3.select("#naturalMinor").on("click", function() {
	d3.selectAll(".note")
	.transition()
	.style("opacity", function(d, i) {
		return naturalMinor(i);
	});
});
d3.select("#harmonicMinor").on("click", function() {
	d3.selectAll(".note")
	.transition()
	.style("opacity", function(d, i) {
		return harmonicMinor(i);
	});
});
d3.select("#chromatic").on("click", function() {
	d3.selectAll(".note")
	.transition()
	.style("opacity", function() {
		return 1;
	});
});
