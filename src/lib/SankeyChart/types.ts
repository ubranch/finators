export interface SVGLineAttributes {
  stroke?: string;
  'stroke-width'?: number;
  'stroke-opacity'?: number;
  'stroke-dasharray'?: string;
}

export const defaultLineAttributes: Required<SVGLineAttributes> = {
  stroke: 'red',
  'stroke-width': 2,
  'stroke-opacity': 0.35,
  'stroke-dasharray': '5,5'
};

export interface ColumnNamesStyle {
  'font-size'?: string;
  color?: string;
  opacity?: string;
  'font-weight'?: string;
  // Add any other CSS properties you might use
}

export interface Settings {
  vertical_gap_between_nodes?: number;
  node_percent_of_column_width?: number;
  show_column_lines?: boolean;
  show_column_names?: boolean;
  show_links_out_of_range?: boolean;
  node_move_y?: boolean;
  linear_gradient_links?: boolean;
  plot_background_color?: string;
  default_nodes_color?: string;
  default_links_color?: string;
  default_links_opacity?: number;
  default_gradient_links_opacity?: number;
  default_sublinks_color?: string;
  default_sublinks_opacity?: number;
  label_colors_object?: Record<string, string>;
  column_names?: string[];
  start_node_count_from?: number;
  start_column_count_from?: number;
  link_min_arc?: number;
  link_arc_iterated_increase?: number;
  lines_style_object?: SVGLineAttributes;
  column_names_style_object?: ColumnNamesStyle;
  on_node_click_function?: (node_info: any, node_data_reference: any, node_element: SVGElement, event: MouseEvent) => void;
  on_link_click_function?: (link_info: any, link_data_reference: any, link_element: SVGElement, event: MouseEvent) => void;
  on_node_hover_function?: (node_info: any, node_data_reference: any, node_element: SVGElement, event: MouseEvent) => string;
  on_link_hover_function?: (link_info: any, link_data_reference: any, link_element: SVGElement, event: MouseEvent) => string;
  hover_node_cursor?: string;
  hover_link_cursor?: string;
  grabbing_node_cursor?: string;
}
