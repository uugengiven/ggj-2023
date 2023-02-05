// using handlebars mostly
Handlebars.registerHelper('numberFixed', function(number) {
    return number.toFixed(2);
});

const draw_plot = (plot) => {
    var plot_script = document.getElementById("plot-template").innerHTML;
    var template = Handlebars.compile(plot_script)

    var html = template(plot)
    return html;
}

const draw_inventory = (seeds) => {
    var inventory_script = document.getElementById("seeds-template").innerHTML;
    var template = Handlebars.compile(inventory_script);

    var html = template(seeds)
    return html;
}

const draw_seed_picker = (id, seeds) => {
    var picker_script = document.getElementById("seeds-picker-template").innerHTML;
    var template = Handlebars.compile(picker_script);

    var html = template({plot_id: id, seeds: seeds})
    return html;
}

const draw_seed_info = (seed) => {
    var info_script = document.getElementById("seed-info-template").innerHTML;
    var template = Handlebars.compile(info_script);

    var html = template(seed)
    return html;    
}

const draw_splice = (seeds) => {
    var splice_script = document.getElementById("splice-template").innerHTML;
    var template = Handlebars.compile(splice_script);

    var html = template(seeds)
    return html;    
}