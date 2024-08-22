export class SankeyNode {
  public original_x: number;
  public original_y: number;
  public current_x: number;
  public current_y: number;
  public column: number;
  public position: number;
  public original_color: string;
  public width: number;
  public height: number;
  public label: string;
  public properties_object: any;
  public links: any[];
  public sankey_plot_object: any;
  public dom_group_node: SVGGElement;
  public dom_rectangle: SVGRectElement;
  public dom_label: SVGTextElement | undefined;
  public mouse_locked: boolean;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    sankey_plot_object: any,
    column: number,
    position: number,
    color: string = 'blue',
    label: string = '',
    properties_object: any = {}
  ) {
    this.original_x = x;
    this.original_y = y;
    this.current_x = x;
    this.current_y = y;
    this.column = column;
    this.position = position;
    this.original_color = color;
    this.width = width;
    this.height = Math.max(0, height);
    this.label = label;
    this.properties_object = properties_object;
    this.links = [];
    this.sankey_plot_object = sankey_plot_object;
    this.dom_group_node = undefined as any;
    this.dom_rectangle = undefined as any;
    this.dom_label = undefined;
    this.mouse_locked = false;
    this.createDomElement();
  }

  private createDomElement(): void {
    this.dom_group_node = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    this.dom_rectangle = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    this.sankey_plot_object.dom_node.appendChild(this.dom_group_node);
    this.dom_group_node.appendChild(this.dom_rectangle);
    this.dom_group_node.style.transform = `translate(${this.original_x}px, ${this.original_y}px)`;
    this.setAttributes(this.dom_rectangle, {
      'width': `${this.width}px`,
      'height': `${Math.max(0, this.height)}px`,
      'fill': this.original_color,
      'x': 0,
      'y': 0,
      'identifier': 'SankeyNode',
      'column': this.column,
      'position': this.position
    });
  }

  public move(new_x: number, new_y: number): void {
    const BORDER_PADDING = this.sankey_plot_object.BORDER_PADDING;

    if (this.sankey_plot_object.node_move_x) {
      let new_x_pos = Math.max(BORDER_PADDING, Math.min(
        new_x - this.width / 2 + this.sankey_plot_object.dom_node.parentNode.scrollLeft,
        this.sankey_plot_object.plot_width - this.width - BORDER_PADDING
      ));
      this.sankey_plot_object.nodes_data_structure[this.column][this.position]['horizontal_shift'] += new_x_pos - this.current_x;
      this.current_x = new_x_pos;
    }
    if (this.sankey_plot_object.node_move_y) {
      let new_y_pos = Math.max(BORDER_PADDING, Math.min(
        new_y - this.height / 2 + this.sankey_plot_object.dom_node.parentNode.scrollTop,
        this.sankey_plot_object.plot_height - this.height - BORDER_PADDING
      ));
      this.sankey_plot_object.nodes_data_structure[this.column][this.position]['vertical_shift'] += new_y_pos - this.current_y;
      this.current_y = new_y_pos;
    }
    this.dom_group_node.style.transform = `translate(${this.current_x}px, ${this.current_y}px)`;
    for (let i in this.links) {
      this.links[i].updateD();
    }
    this.redraw();
  }

  public redraw(): void {
    this.sankey_plot_object.dom_node.removeChild(this.dom_group_node);
    this.sankey_plot_object.dom_node.appendChild(this.dom_group_node);
  }

  public addLink(link: any): void {
    this.links.push(link);
  }

  private setAttributes(element: Element, attributes: Record<string, string | number>): void {
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value.toString());
    }
  }
}
