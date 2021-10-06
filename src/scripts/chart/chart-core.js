function donutChart() {
    var width,
        height,
        darkMode,
        margin = { top: 10, right: 10, bottom: 10, left: 10 },
        colour = d3.scaleOrdinal(d3.schemeCategory20), // colour scheme
        variable, // value in data that will dictate proportions on chart
        category, // compare data by
        padAngle, // effectively dictates the gap between slices
        floatFormat = d3.format('.4r'),
        cornerRadius, // sets how rounded the corners are on each slice
        percentFormat = d3.format(',.2%');

    function chart(selection) {
        selection.each(function (data) {
            // generate chart

            // ===========================================================================================
            // Set up constructors for making donut. See https://github.com/d3/d3-shape/blob/master/README.md
            var radius = 135;

            // creates a new pie generator
            var pie = d3.pie()
                .value(function (d) { return floatFormat(d[variable]); })
                .sort(null);

            // contructs and arc generator. This will be used for the donut. The difference between outer and inner
            // radius will dictate the thickness of the donut
            var arc = d3.arc()
                .outerRadius(radius * 0.9)
                .innerRadius(radius * 0.8)
                .cornerRadius(cornerRadius)
                .padAngle(padAngle);

            // this arc is used for aligning the text labels
            var outerArc = d3.arc()
                .outerRadius(radius * 0.9)
                .innerRadius(radius * 0.9);
            // ===========================================================================================

            var tempAngle;
            var tempOffset = {
                x: 1,
                y: 0.95
            };
            // ===========================================================================================
            // append the svg object to the selection
            var svg = selection.append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .attr('class', 'backColorChart')
                .append('g')
                .attr('transform', 'translate(' + (width / 2 - 105) + ',' + (height / 2 + 12) + ')');
            // ===========================================================================================

            // ===========================================================================================
            // g elements to keep elements within svg modular
            svg.append('g').attr('class', 'slices');
            svg.append('g').attr('class', 'labelName');
            svg.append('g').attr('class', 'lines');
            // ===========================================================================================

            // ===========================================================================================
            // add and colour the donut slices
            var path = svg.select('.slices')
                .datum(data).selectAll('path')
                .data(pie)
                .enter().append('path')
                .attr('fill', function (d) { return colour(d.data[category]); })
                .attr('d', arc)
                .attr('id', function (d) { return d.data[category]; });
            // ===========================================================================================

            var legendG = svg.selectAll(".legend") // note appending it to mySvg and not svg to make positioning easier
                .data(pie(data))
                .enter().append("g")
                .attr("transform", function (d, i) {
                    return "translate(" + (130) + "," + (i * 20 - 80) + ")"; // place each legend on the right and bump each one down 15 pixels
                })
                .attr("class", "legend");

            if (darkMode)
                legendG.style("fill", "#ffffff");
            else legendG.style("fill", "black");

            legendG.append("rect") // make a matching color rect
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", function (d, i) {
                    return colour(d.data[category]);
                });

            if (darkMode)
                legendG.append("text") // add the text
                    .text(function (d) {
                        return d.data.url;
                    })
                    .style("font-size", 13)
                    .style('fill', '#ffffff')
                    .attr("y", 10)
                    .attr("x", 13);
            else
                legendG.append("text") // add the text
                    .text(function (d) {
                        return d.data.url;
                    })
                    .style("fill", "black")
                    .style("font-size", 13)
                    .attr("y", 10)
                    .attr("x", 13);

            // ===========================================================================================
            // add tooltip to mouse events on slices and labels
            d3.selectAll('.labelName text, .slices path').call(toolTip);
            // ===========================================================================================

            // ===========================================================================================
            // Functions

            // calculates the angle for the middle of a slice
            function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }

            // function that creates and adds the tool tip to a selected element
            function toolTip(selection) {

                // add tooltip (svg circle element) when mouse enters label or slice
                selection.on('mouseenter', function (data) {
                    d3.selectAll('.toolCircle').remove();
                    if (darkMode)
                        svg.append('text')
                            .attr('class', 'toolCircle')
                            .attr('dy', -15) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
                            .html(toolTipHTML(data)) // add text to the circle.
                            .style('font-size', '.9em')
                            .style('fill', '#ffffff')
                            .style('text-anchor', 'middle'); // centres text in tooltip
                    else
                        svg.append('text')
                            .attr('class', 'toolCircle')
                            .attr('dy', -15)
                            .html(toolTipHTML(data))
                            .style('font-size', '.9em')
                            .style('text-anchor', 'middle');

                    svg.append('circle')
                        .attr('class', 'toolCircle')
                        .attr('r', radius * 0.75) // radius of tooltip circle
                        .style('fill', colour(data.data[category])) // colour based on category mouse is over
                        .style('fill-opacity', 0.35);

                });

                // remove the tooltip when mouse leaves the slice/label
                // selection.on('mouseout', function () {
                //     d3.selectAll('.toolCircle').remove();
                // });
            }

            // function to create the HTML string for the tool tip. Loops through each key in data object
            // and returns the html string key: value
            function toolTipHTML(data) {

                var tip = '',
                    i = 0;

                for (var key in data.data) {

                    // if value is a number, format it as a percentage
                    var value = (!isNaN(parseFloat(data.data[key]))) ? percentFormat(data.data[key]) : data.data[key];
                    if (key === 'summary')
                        value = convertSummaryTimeToString(data.data[key]);
                    if (key === 'visits' && data.data[key] !== undefined)
                        value = data.data[key] + ' visits';
                    var className = '';
                    if (key === 'percentage')
                        className = 'class="percentageValue"';

                    // leave off 'dy' attr for first tspan so the 'dy' attr on text element works. The 'dy' attr on
                    // tspan effectively imitates a line break.
                    if (i === 0) tip += '<tspan x="0">' + value + '</tspan>';
                    else tip += '<tspan x="0" dy="1.2em"' + className + '>' + value + '</tspan>';
                    i++;
                }

                return tip;
            }

            function angleIsInRangeDifference(tempAngle, currentAngle, difference) {
                return currentAngle < (tempAngle + difference) && currentAngle > (tempAngle - difference);
            }
            // ===========================================================================================

        });
    }

    chart.width = function (value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.height = function (value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.darkMode = function (value) {
        if (!arguments.length) return darkMode;
        darkMode = value;
        return chart;
    };

    chart.margin = function (value) {
        if (!arguments.length) return margin;
        margin = value;
        return chart;
    };

    chart.radius = function (value) {
        if (!arguments.length) return radius;
        radius = value;
        return chart;
    };

    chart.padAngle = function (value) {
        if (!arguments.length) return padAngle;
        padAngle = value;
        return chart;
    };

    chart.cornerRadius = function (value) {
        if (!arguments.length) return cornerRadius;
        cornerRadius = value;
        return chart;
    };

    chart.colour = function (value) {
        if (!arguments.length) return colour;
        colour = value;
        return chart;
    };

    chart.variable = function (value) {
        if (!arguments.length) return variable;
        variable = value;
        return chart;
    };

    chart.category = function (value) {
        if (!arguments.length) return category;
        category = value;
        return chart;
    };

    return chart;
}

function barChart(data) {
    var margin = { top: 25, right: 5, bottom: 25, left: 5 },
        width = 555,
        height = 160;

    // set the ranges
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var y = d3.scaleLinear()
        .range([height, 0]);

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#barChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            if (data.length > 9)
                return "<strong><span class='red-label'>" + new Date(d.date).toLocaleDateString() + "</span></strong></br><strong>" + convertShortSummaryTimeToString(d.total) + "</strong>";
            else
                return "<strong>" + convertShortSummaryTimeToString(d.total) + "</strong>";
        });

    svg.call(tip);

    // Scale the range of the data in the domains
    x.domain(data.map(function (d) { return new Date(d.date).toLocaleDateString(); }));
    y.domain([0, d3.max(data, function (d) { return d.total; })]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return x(new Date(d.date).toLocaleDateString()); })
        .attr("width", x.bandwidth())
        .attr("y", function (d) { return y(d.total); })
        .attr("height", function (d) { return height - y(d.total); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    if (data.length > 9)
        document.querySelectorAll('#barChart g.tick ').forEach(element => { element.remove() });
}

function drawIntervalChart(data) {
    data.forEach(function (item) {
        var hFrom = getHourFrom(item.interval);
        var hTo = getHourTo(item.interval);
        if (hFrom != hTo) {
            var sourceTimeFrom = item.interval.split('-')[0].split(':');
            var sourceTimeTo = item.interval.split('-')[1].split(':');
            var timeTo = sourceTimeFrom[0] + ":" + 59 + ":" + 59;
            var timeFrom = sourceTimeTo[0] + ":" + 00 + ":" + 00;
            data.push({ "domain": item.domain, "interval": item.interval.split('-')[0] + "-" + timeTo });
            data.push({ "domain": item.domain, "interval": timeFrom + "-" + item.interval.split('-')[1] });
        }
    });

    var margin = { top: 5, right: 10, bottom: 20, left: 20 },
        width = 580 - margin.left - margin.right,
        height = 410 - margin.top - margin.bottom;

    //linear 24 hour scale
    var y = d3.scaleLinear()
        .domain([0, 60])
        .range([height, 0]);

    //vertical axis
    var yAxis = d3.axisLeft()
        .ticks(10)
        .scale(y);

    var x = d3.scaleLinear()
        .domain([0, 24])
        .range([0, width]);

    //vertical axis
    var xAxis = d3.axisBottom()
        .ticks(24)
        .scale(x)

    var tickDistance = 4.38;

    var tooltip;
    if (document.body.classList.contains('night-mode'))
        tooltip = d3.select("#timeChart")
            .append("div")
            .style("opacity", 0)
            .style("display", "none")
            .style("position", "absolute")
            .attr("class", "tooltip")
            .style("background-color", "#cbcbcb")
            .style("color", "black")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "5px")
    else
        tooltip = d3.select("#timeChart")
            .append("div")
            .style("opacity", 0)
            .style("display", "none")
            .style("position", "absolute")
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("color", "black")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "5px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
        tooltip
            .style("opacity", 1)
            .style("display", "block")
        d3.select(this)
            .style("stroke", "black")
            .style("stroke-width", "0.5px")
            .style("opacity", 1)
    }
    var mousemove = function (d) {
        tooltip
            .html(d.domain + "<br>" + d.interval)
            .style("left", (d3.mouse(this)[0]) + 10 + "px")
            .style("top", (d3.mouse(this)[1]) + 30 + "px")
    }
    var mouseleave = function (d) {
        tooltip
            .style("opacity", 0)
            .style("display", "none")
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
    }

    //create the svg
    var svg;
    if (document.body.classList.contains('night-mode'))
        svg = d3.select("#timeChart").append("svg")
            .style('background-color', '#383838')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    else
        svg = d3.select("#timeChart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //draw the axis.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "label")
        .call(xAxis)
        .append("text")
        .text("Value");

    // Add a y-axis with label.
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .text("Value");

    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_axis()
            .tickSize(-height, 0, 0)
        )

    svg.append("g")
        .attr("class", "grid")
        .call(make_y_axis()
            .tickSize(-width, 0, 0)
        )

    //draw the bars, offset y and bar height based on data
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .style("fill", "orangered")
        .style("stroke", "#f1f1f1")
        .style("stroke-width", "1")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(getHourFrom(d.interval)) + 2;
        })
        .attr("width", 20)
        .attr("y", function (d) {
            return y(getMinutesTo(d.interval)) - 1;
        })
        .attr("height", function (d) {
            var offset = getMinutesTo(d.interval) - getMinutesFrom(d.interval);
            if (offset <= 0) {
                var offsetSeconds = getSecondsTo(d.interval) - getSecondsFrom(d.interval);
                if (offsetSeconds <= 3)
                    return 0;
                else
                    return 1;
            }
            else return offset * tickDistance;
        })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

    function make_x_axis() {
        return d3.axisBottom()
            .scale(x)
            .ticks(24)
    }

    function make_y_axis() {
        return d3.axisLeft()
            .scale(y)
            .ticks(10)
    }

    function getHourFrom(interval) {
        var time = interval.split('-')[0];
        return time.split(':')[0];
    }

    function getHourTo(interval) {
        var time = interval.split('-')[1];
        return time.split(':')[0];
    }

    function getMinutesFrom(interval) {
        var time = interval.split('-')[0];
        return time.split(':')[1];
    }

    function getMinutesTo(interval) {
        var time = interval.split('-')[1];
        return time.split(':')[1];
    }

    function getSecondsFrom(interval) {
        var time = interval.split('-')[0];
        return time.split(':')[2];
    }

    function getSecondsTo(interval) {
        var time = interval.split('-')[1];
        return time.split(':')[2];
    }
}