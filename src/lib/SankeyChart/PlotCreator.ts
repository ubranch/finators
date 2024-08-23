import { SankeyPlot } from './SankeyPlot';
import { SANKEY_STYLES } from './SankeyStyles';

import { Settings } from './types';

export interface NodeCoordinates {
  column: number;
  node: number;
}

export type LinkType = 'LR' | 'RL' | 'RR' | 'LL';

export interface SingleSublinkData {
  value: number;
  shift: number;
  color?: string;
}

export interface SingleLinkData {
  from: NodeCoordinates;
  to: NodeCoordinates;
  value: number;
  link_type?: LinkType;
  color?: string | { start: string; end: string };
  sublinks?: SingleSublinkData[];
}

export interface SingleNodeData {
  label?: string;
  width?: number;
  color?: string;
}

export class PlotCreator {
  private dom_container: HTMLElement;
  private nodes_data: SingleNodeData[][];
  private links_data_structure: SingleLinkData[];
  private plot_width: number;
  private plot_height: number;
  private first_column: number;
  private last_column: number;
  private settings: Settings;
  private sankey_plot: SankeyPlot;
  private longest_link_length: number | undefined;
  private nodes_data_structure: any[];
  private last_column_width: number;
  private node_height_unit: number = 0;

  constructor(
    dom_container: HTMLElement,
    nodes_data: SingleNodeData[][],
    links_data: SingleLinkData[],
    plot_width: number,
    plot_height: number,
    first_column: number,
    last_column: number,
    settings: Settings = {}
  ) {
    this.dom_container = dom_container;
    this.dom_container.setAttribute('id', 'sankey_plot_auto_container');
    this.dom_container.style.overflow = 'auto';
    this.dom_container.classList.add('noselect');

    this.nodes_data = nodes_data;
    this.links_data_structure = links_data;
    this.plot_width = plot_width;
    this.plot_height = plot_height;
    this.first_column = first_column;
    this.last_column = last_column;
    this.settings = this.mergeSettings(settings);

    this.longest_link_length = undefined;
    this.nodes_data_structure = [];
    this.preprocessLinksData();
    this.sortLinks();
    this.prepareData();
    this.calculateNodeHeightUnit();
    this.last_column_width = this.plot_width / (this.last_column - this.first_column);
    this.sankey_plot = this.setNewPlot();
    this.applyStyles();
  }


  private calculateNodeHeightUnit(): void {
    let max_column_sum = 0;
    for (let column of this.nodes_data_structure) {
      let column_sum = column.reduce((sum: number, node: any) => {
        return sum + Math.max(node.left_side_sum || 0, node.right_side_sum || 0);
      }, 0);
      max_column_sum = Math.max(max_column_sum, column_sum);
    }
    this.node_height_unit = (1 - (this.settings.vertical_gap_between_nodes || 0)) * this.plot_height / max_column_sum;
  }

  private applyStyles(): void {
    const styleElement = document.createElement('style');
    styleElement.textContent = SANKEY_STYLES;
    document.head.appendChild(styleElement);
  }

  private mergeSettings(userSettings: Settings): Settings {
    const defaultSettings: Settings = {
      vertical_gap_between_nodes: 0.2,
      node_percent_of_column_width: 0.3,
      show_column_lines: true,
      show_column_names: true,
      show_links_out_of_range: true,
      node_move_y: true,
      linear_gradient_links: true,
      plot_background_color: '#f5ecec',
      default_links_color: 'blue',
      default_nodes_color: 'grey',
      default_links_opacity: 0.25,
      default_gradient_links_opacity: 0.43,
      default_sublinks_color: 'red',
      default_sublinks_opacity: 0.8,
      label_colors_object: {},
      start_node_count_from: 0,
      start_column_count_from: 0,
      link_min_arc: 5,
      link_arc_iterated_increase: 5,
      on_node_hover_function: (node_info) => `${node_info['label']}`,
      on_link_hover_function: (link_info) => `From: (column - ${link_info['from_column']}, node - ${link_info['from_node']}, label - "${link_info['from_label']}") To: (column - ${link_info['to_column']}, node - ${link_info['to_node']}, label - "${link_info['to_label']}") Value: ${link_info['value']}`,
      hover_node_cursor: 'pointer',
      hover_link_cursor: 'help',
      grabbing_node_cursor: 'grabbing',
    };

    return { ...defaultSettings, ...userSettings };
  }

  private preprocessLinksData(): void {
    for (let i in this.links_data_structure) {
      let link = this.links_data_structure[i];
      let from_column = link['from']['column'];
      let to_column = link['to']['column'];
      if (from_column === to_column) {
        if (link['from']['node'] === link['to']['node']) {
          if (['LL', 'RR'].includes(link['link_type'] as LinkType)) {
            throw new Error('RR,LL LINKS CANNOT YET BE DEFINED BETWEEN THE SAME NODE');
          } else if (link['link_type'] === undefined || link['link_type'] === 'LR' || link['link_type'] === 'RL') {
            link['link_type'] = 'LR';
          } else {
            throw new Error(`"${link['link_type']}" IS NOT A VALID LINK TYPE`);
          }
        } else {
          throw new Error("LINKS CANNOT BE DEFINED BETWEEN NODES IN THE SAME COLUMN, UNLESS IT'S THE SAME NODE");
        }
      } else if (from_column > to_column) {
        if (!link.hasOwnProperty('link_type')) {
          link['link_type'] = 'LR';
          (link as any)['reversed'] = true;
          let _ = link['from'];
          link['from'] = link['to'];
          link['to'] = _;
        } else if (['LR', 'RL', 'LL', 'RR'].includes(link['link_type'] as LinkType)) {
          link['link_type'] = (link['link_type'] as string)[1] + (link['link_type'] as string)[0] as LinkType;
          (link as any)['reversed'] = true;
          let _ = link['from'];
          link['from'] = link['to'];
          link['to'] = _;
        } else {
          throw new Error(`"${link['link_type']}" IS NOT A VALID LINK TYPE`);
        }
      }
    }
  }

  private sortLinks(): void {
    this.links_data_structure.sort((a, b) => a['from']['node'] - b['from']['node']);
    this.links_data_structure.sort((a, b) => a['from']['column'] - b['from']['column']);
    this.links_data_structure.sort((a, b) => a['to']['node'] - b['to']['node']);
    this.links_data_structure.sort((a, b) => (a['to']['column'] - a['from']['column']) - (b['to']['column'] - b['from']['column']));
    const last_link = this.links_data_structure[this.links_data_structure.length - 1];
    this.longest_link_length = last_link['to']['column'] - last_link['from']['column'];
  }

  private prepareData(): void {
    for (let i in this.nodes_data) {
      let column: any[] = [];
      for (let j in this.nodes_data[i]) {
        column.push({
          properties_object: this.nodes_data[i][j],
          height: 0,
          y: 0,
          horizontal_shift: 0,
          vertical_shift: 0,
          left_side_sum: 0,
          right_side_sum: 0,
          links_references: []
        });
      }
      this.nodes_data_structure.push(column);
    }

    for (let i in this.links_data_structure) {
      let link = this.links_data_structure[i];
      this.nodes_data_structure[link['from']['column']][link['from']['node']]['links_references'].push({
        link_id: i,
        second_node_column: link['to']['column'],
        second_node_position: link['to']['node']
      });

      if (!(link['to']['column'] === link['from']['column'] && link['to']['node'] === link['from']['node'])) {
        this.nodes_data_structure[link['to']['column']][link['to']['node']]['links_references'].push({
          link_id: i,
          second_node_column: link['from']['column'],
          second_node_position: link['from']['node']
        });
      }

      switch (link['link_type']) {
        case 'LL':
          this.nodes_data_structure[link['from']['column']][link['from']['node']]['left_side_sum'] += link['value'];
          this.nodes_data_structure[link['to']['column']][link['to']['node']]['left_side_sum'] += link['value'];
          break;
        case 'LR':
          this.nodes_data_structure[link['from']['column']][link['from']['node']]['left_side_sum'] += link['value'];
          this.nodes_data_structure[link['to']['column']][link['to']['node']]['right_side_sum'] += link['value'];
          break;
        case 'RR':
          this.nodes_data_structure[link['from']['column']][link['from']['node']]['right_side_sum'] += link['value'];
          this.nodes_data_structure[link['to']['column']][link['to']['node']]['right_side_sum'] += link['value'];
          break;
        case 'RL':
        case undefined:
          this.nodes_data_structure[link['from']['column']][link['from']['node']]['right_side_sum'] += link['value'];
          this.nodes_data_structure[link['to']['column']][link['to']['node']]['left_side_sum'] += link['value'];
          break;
        default:
          throw new Error(`${link['link_type']} IS NOT A VALID LINK TYPE`);
      }
    }

    let max = 0;
    let col_sums: number[] = [];
    for (let i in this.nodes_data_structure) {
      let current_column_sum = 0;
      for (let j in this.nodes_data_structure[i]) {
        let node = this.nodes_data_structure[i][j];
        let height = Math.max(node['right_side_sum'], node['left_side_sum']);
        node['height'] = isNaN(height) ? 0 : height;
        if (height > max) {
          max = height;
        }
        current_column_sum += height;
      }
      col_sums.push(current_column_sum);
    }
    let max_column_sum = Math.max(...col_sums);
    this.node_height_unit = (1 - this.settings.vertical_gap_between_nodes!) * this.plot_height / max_column_sum;

    for (let i in this.nodes_data_structure) {
      let gaps = this.nodes_data_structure[i].length + 1;
      let gap_height = (this.settings.vertical_gap_between_nodes! * this.plot_height / this.node_height_unit +
        (max_column_sum - col_sums[parseInt(i)])) / gaps;
      let height_used = gap_height;
      for (let j in this.nodes_data_structure[i]) {
        let node = this.nodes_data_structure[i][j];
        node['y'] = height_used * this.node_height_unit;
        height_used += node['height'];
        node['height'] *= this.node_height_unit;
        height_used += gap_height;
      }
    }

    for (let column_index in this.nodes_data_structure) {
      for (let node_index in this.nodes_data_structure[column_index]) {
        let node = this.nodes_data_structure[column_index][node_index];
        let left_side_links_normal: any[] = [];
        let right_side_links_normal: any[] = [];
        let left_side_links_special: any[] = [];
        let right_side_links_special: any[] = [];
        for (let link_index in node['links_references']) {
          let link = this.links_data_structure[node['links_references'][link_index]['link_id']];
          switch (link['link_type']) {
            case 'LL':
              if (node['links_references'][link_index]['second_node_column'] > parseInt(column_index)) {
                left_side_links_special.push(link);
              } else {
                left_side_links_normal.push(link);
              }
              break;
            case 'LR':
              if (node['links_references'][link_index]['second_node_column'] > parseInt(column_index)) {
                left_side_links_special.push(link);
              } else if (node['links_references'][link_index]['second_node_column'] == parseInt(column_index)) {
                left_side_links_special.push(link);
                right_side_links_special.push(link);
              } else {
                right_side_links_special.push(link);
              }
              break;
            case 'RR':
              if (node['links_references'][link_index]['second_node_column'] > parseInt(column_index)) {
                right_side_links_normal.push(link);
              } else {
                right_side_links_special.push(link);
              }
              break;
            case 'RL':
            case undefined:
              if (node['links_references'][link_index]['second_node_column'] > parseInt(column_index)) {
                right_side_links_normal.push(link);
              } else {
                left_side_links_normal.push(link);
              }
              break;
            default:
              throw new Error(`${link['link_type']} IS NOT A VALID LINK TYPE`);
          }
        }

        let left_side_occupied_height = 0;
        for (let i in left_side_links_normal) {
          let link = left_side_links_normal[i];
          link['right_side_rel_to_node_height'] = left_side_occupied_height;
          left_side_occupied_height += link['value'] * this.node_height_unit;
        }
        let right_side_occupied_height = 0;
        for (let i in right_side_links_normal) {
          let link = right_side_links_normal[i];
          link['left_side_rel_to_node_height'] = right_side_occupied_height;
          right_side_occupied_height += link['value'] * this.node_height_unit;
        }

        left_side_links_special.sort((a, b) => b['to']['node'] - a['to']['node']);
        left_side_links_special.sort((a, b) => b['to']['column'] - a['to']['column']);
        let node_height = node['height'];
        let left_side_curve = -this.settings.link_arc_iterated_increase! + this.settings.link_min_arc!;
        let left_side_occupied_height_special = 0;
        for (let i = left_side_links_special.length - 1; i >= 0; i--) {
          let special_link = left_side_links_special[i];
          let link_height = special_link['value'] * this.node_height_unit;
          special_link['left_side_rel_to_node_height'] = node_height - left_side_occupied_height_special - link_height;
          left_side_occupied_height_special += link_height;
          special_link['left_side_curve'] = left_side_curve + this.settings.link_arc_iterated_increase!;
          left_side_curve += link_height + this.settings.link_arc_iterated_increase!;
        }

        right_side_links_special.sort((a, b) => b['from']['node'] - a['from']['node']);
        right_side_links_special.sort((a, b) => a['from']['column'] - b['from']['column']);
        let right_side_curve = -this.settings.link_arc_iterated_increase! + this.settings.link_min_arc!;
        let right_side_occupied_height_special = 0;
        for (let i = right_side_links_special.length - 1; i >= 0; i--) {
          let special_link = right_side_links_special[i];
          let link_height = special_link['value'] * this.node_height_unit;
          special_link['right_side_rel_to_node_height'] = node_height - right_side_occupied_height_special - link_height;
          right_side_occupied_height_special += link_height;
          special_link['right_side_curve'] = right_side_curve + this.settings.link_arc_iterated_increase!;
          right_side_curve += link_height + this.settings.link_arc_iterated_increase!;
        }
      }
    }
  }

  private setNewPlot(): SankeyPlot {
    this.dom_container.replaceChildren();

    return new SankeyPlot(
      this.dom_container,
      this.nodes_data_structure,
      this.links_data_structure,
      this.plot_width,
      this.plot_height,
      this.settings.node_percent_of_column_width!,
      this.first_column,
      this.last_column,
      this.node_height_unit,
      this.longest_link_length!,
      this.last_column_width,
      this.settings.show_column_lines!,
      this.settings.show_column_names!,
      false, // node_move_x
      this.settings.node_move_y!,
      this.settings.linear_gradient_links!,
      this.settings.link_arc_iterated_increase!,
      this.settings.label_colors_object!,
      this.settings.plot_background_color!,
      this.settings.default_links_color!,
      this.settings.default_links_opacity!,
      this.settings.default_gradient_links_opacity!,
      this.settings.default_sublinks_color!,
      this.settings.default_sublinks_opacity!,
      this.settings.lines_style_object!,
      this.settings.column_names,
      this.settings.column_names_style_object!,
      this.settings.default_nodes_color!,
      this.settings.start_node_count_from!,
      this.settings.start_column_count_from!,
      this.settings.show_links_out_of_range!,
      this.settings.on_node_click_function,
      this.settings.on_link_click_function,
      this.settings.on_node_hover_function!,
      this.settings.on_link_hover_function!,
      this.settings.hover_node_cursor!,
      this.settings.hover_link_cursor!,
      this.settings.grabbing_node_cursor!
    );
  }

  public changeColumnRange(first_column: number, last_column: number): boolean {
    if (first_column < this.settings.start_column_count_from! || last_column > this.nodes_data_structure.length + this.settings.start_column_count_from! || first_column >= last_column) {
      console.warn(`CANNOT CHANGE COLUMN RANGE TO (${first_column},${last_column}).`);
      return false;
    } else {
      this.first_column = first_column - this.settings.start_column_count_from!;
      this.last_column = last_column - this.settings.start_column_count_from!;
      this.reloadPlot();
      return true;
    }
  }

  public reloadPlot(): void {
    if (this.sankey_plot && this.sankey_plot.dom_node) {
      this.dom_container.removeChild(this.sankey_plot.dom_node);
      this.sankey_plot = undefined as any; // don't remove - may trigger garbage collector faster
      this.sankey_plot = this.setNewPlot();
    } else {
      console.warn('Sankey plot or its DOM node is not available for removal.');
      this.sankey_plot = this.setNewPlot();
    }
  }

  public columnNames(show: boolean): void {
    this.settings.show_column_names = show;
    this.reloadPlot();
  }

  public columnLines(show: boolean): void {
    this.settings.show_column_lines = show;
    this.reloadPlot();
  }

  public yMovement(allow: boolean): void {
    this.settings.node_move_y = allow;
    this.reloadPlot();
  }

  public linearGradient(use: boolean): void {
    this.settings.linear_gradient_links = use;
    this.reloadPlot();
  }

  public removePlot(): void {
    if (this.sankey_plot) {
      this.sankey_plot.clearData();
      if (this.sankey_plot.dom_node && this.dom_container.contains(this.sankey_plot.dom_node)) {
        this.dom_container.removeChild(this.sankey_plot.dom_node);
      }
    }
    this.sankey_plot = undefined as any;
    this.links_data_structure = undefined as any;
    this.nodes_data_structure = undefined as any;
    this.nodes_data = undefined as any;
    if (this.dom_container.parentNode) {
      this.dom_container.parentNode.removeChild(this.dom_container);
    }
  }
}
