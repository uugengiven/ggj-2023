// using handlebars mostly

const draw_plot = (plot) => {
    var plot_script = document.getElementById("plot-template").innerHTML;
    var template = Handlebars.compile(plot_script)

    var html = template(plot)
    return html;
}