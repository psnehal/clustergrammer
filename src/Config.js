
function Config(args) {

  var config,
    defaults;

  defaults = {

    // This should be a DOM element, not a selector.
    svg_div_id: 'svg_id',
    label_overflow: {
      row: 1,
      col: 1
    },
    row_label_scale: 1,
    col_label_scale: 1,
    transpose: false,
    title_tile: false,

    // Red and blue
    tile_colors: ['#FF0000', '#1C86EE'],
    background_color: '#FFFFFF',
    super_border_color: '#F5F5F5',
    do_zoom: true,

    // Default domain is set to 0, which means that the domain will be set automatically
    input_domain: 0,
    opacity_scale: 'linear',
    resize: true,
    outer_margins: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    },
    super_labels: false,

    // Gray border around the visualization
    grey_border_width: 3,

    // the distance between labels and clustergram
    // a universal margin for the clustergram
    uni_margin: 4,
    uni_margin_row: 2
  };

  // Mixin defaults with user-defined arguments.
  config = Utils.extend(defaults, args);

  // super label width - the labels are 20px wide if they are included
  if (config.super_labels) {
    // include super labels
    config.super_label_width = 20;
  } else {
    // do not include super labels
    config.super_label_width = 0;
  }

  // super-row/col labels
  if (!Utils.is_undefined(args.row_label) && !Utils.is_undefined(args.col_label)) {
    config.super_labels = true;
    config.super = {};
    config.super.row = args.row_label;
    config.super.col = args.col_label;
  }

  // transpose network data and super-labels
  if (config.transpose) {
    config.super.row = args.col_label;
    config.super.col = args.row_label;
  } 

  // initialize cluster ordering 
  if (!Utils.is_undefined(args.order) && is_supported_order(args.order)) {
    config.inst_order = args.order;
  } else {
    config.inst_order = 'clust';
  }

  config.show_dendrogram = Utils.has(args.network_data.row_nodes[0], 'group') || Utils.has(col_nodes[0], 'group');
  config.show_categories = Utils.has(args.network_data.row_nodes[0], 'cl') || Utils.has(col_nodes[0], 'cl');

  // row groups - only add if the rows have a group attribute
  // Define the space needed for the classification of rows - includes classification triangles and rects
  config.class_room = {};
  if (config.show_dendrogram) {
    // make room for group rects
    config.class_room.row = 18;
    config.class_room.col = 9;
    // the width of the classification triangle or group rectangle
    config.class_room.symbol_width = 9;

    config.group_level = {
    row: 5,
    col: 5
    };

  } else {
    // do not make room for group rects
    config.class_room.row = 9;
    config.class_room.col = 0;
    // the width of the classification triangle or group rectangle
    config.class_room.symbol_width = 9;
  }

  // check if row/col have class information
  if (config.show_categories) {

    config.class_colors = {};
    
    // !! the class colors can be the same for rows and cols 
    
    // associate classes with colors
    var class_rows = _.uniq(_.pluck(row_nodes, 'cl'));
    config.class_colors.row = {};
    _.each(class_rows, function(c_row, i) {
      config.class_colors.row[c_row] = Colors.get_random_color(i+50);
    });

    // associate classes with colors
    var class_cols = _.uniq(_.pluck(col_nodes, 'cl'));
    config.class_colors.col = {};
    _.each(class_cols, function(c_col, i) {
      if (i === 0) {
        config.class_colors.col[c_col] = '#eee';
      } else {
        config.class_colors.col[c_col] = Colors.get_random_color(i+50);
      }
    });
  }



  function is_supported_order(order) {
    return order === 'clust' || order === 'rank' || order === 'class';
  }

  return config;
}