abstract class SankeyLink {
  protected node1: any;
  protected node2: any;
  protected height: number;
  protected sankey_plot_object: any;
  protected links_array_index: number;
  protected fill: string | undefined;
  protected opacity: number | undefined;
  public dom_node: SVGPathElement;
  protected node1_render_height: number;
  protected node2_render_height: number;
  protected sublink_data: any;
  protected parent_link_height: number | undefined;
  protected sublink_index: number | undefined;
  protected fillGradient: string | undefined;

  constructor(
    node1: any,
    node2: any,
    height: number,
    sankey_plot_object: any,
    links_array_index: number,
    color: string | { start: string; end: string } | undefined = undefined,
    sublink_data: any = undefined,
  ) {
    this.node1 = node1;
    this.node2 = node2;
    this.height = height;
    this.sankey_plot_object = sankey_plot_object;
    this.links_array_index = links_array_index;
    if (typeof color === "object" && color.start && color.end) {
      this.createGradient(color.start, color.end);
    } else if (typeof color === "string") {
      this.fill = color;
    }
    this.opacity = undefined;
    this.dom_node = undefined as any;
    this.node1_render_height = 0;
    this.node2_render_height = 0;
    this.node1.addLink(this);
    this.node2.addLink(this);
    this.node1_render_height =
      this.sankey_plot_object.links_data[this.links_array_index][
        "left_side_rel_to_node_height"
      ];
    this.node2_render_height =
      this.sankey_plot_object.links_data[this.links_array_index][
        "right_side_rel_to_node_height"
      ];
    this.sublink_data = undefined;
    if (sublink_data) {
      this.sublink_data = sublink_data[0];
      this.node1_render_height += this.height * this.sublink_data["shift"];
      this.node2_render_height += this.height * this.sublink_data["shift"];
      this.parent_link_height = this.height;
      this.height =
        this.sankey_plot_object.node_height_unit * this.sublink_data["value"];
      this.sublink_index = sublink_data[1];
    }
    this.linearGradient(color); // Pass color to linearGradient
  }

  private createGradient(startColor: string, endColor: string): void {
    const gradientId = `gradient-${this.links_array_index}`;
    const gradient = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "linearGradient",
    );
    this.setAttributes(gradient, {
      id: gradientId,
      x1: "0%",
      y1: "0%",
      x2: "100%",
      y2: "0%",
    });

    const stop1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop",
    );
    this.setAttributes(stop1, {
      offset: "0%",
      "stop-color": startColor,
    });

    const stop2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "stop",
    );
    this.setAttributes(stop2, {
      offset: "100%",
      "stop-color": endColor,
    });

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    this.sankey_plot_object.defs.appendChild(gradient);

    this.fillGradient = `url(#${gradientId})`;
  }

  protected abstract calculateD(
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    path_height: number,
    node1_width: number,
    node2_width: number,
  ): string;

  public updateD(): void {
    this.dom_node.setAttribute(
      "d",
      this.calculateD(
        this.node1.current_x,
        this.node2.current_x,
        this.node1.current_y + this.node1_render_height,
        this.node2.current_y + this.node2_render_height,
        this.height,
        this.node1.width,
        this.node2.width,
      ),
    );
    this.sankey_plot_object.dom_node.removeChild(this.dom_node);
    this.sankey_plot_object.dom_node.appendChild(this.dom_node);
  }

  private linearGradient(
    color: string | { start: string; end: string } | undefined,
  ): void {
    if (
      this.sankey_plot_object.linear_gradient_links &&
      !this.fill &&
      !this.sublink_data
    ) {
      let color1, color2;

      if (typeof color === "object" && color.start && color.end) {
        // Use provided start and end colors for gradient
        color1 = color.start;
        color2 = color.end;
      } else {
        // Use node colors for gradient
        color1 = this.node1.original_color;
        color2 = this.node2.original_color;
      }

      if (
        !this.sankey_plot_object.linear_gradient_colors_object.hasOwnProperty(
          color1,
        )
      ) {
        this.sankey_plot_object.linear_gradient_colors_object[color1] = {};
      }
      if (
        !this.sankey_plot_object.linear_gradient_colors_object[
          color1
        ].hasOwnProperty(color2)
      ) {
        let linear = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "linearGradient",
        );
        this.setAttributes(linear, {
          id: `_${color1}_to_${color2}`,
          x1: "0%",
          x2: "100%",
          y1: "0%",
          y2: "0%",
        });
        let stop1 = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "stop",
        );
        stop1.setAttribute("offset", "0%");
        stop1.style.stopColor = color1;
        stop1.style.stopOpacity = "1";
        let stop2 = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "stop",
        );
        stop2.setAttribute("offset", "100%");
        stop2.style.stopColor = color2;
        stop2.style.stopOpacity = "1";
        linear.appendChild(stop1);
        linear.appendChild(stop2);
        this.sankey_plot_object.defs.appendChild(linear);
        this.sankey_plot_object.linear_gradient_colors_object[color1][color2] =
          true;
      }
      this.fill = `url('#_${color1}_to_${color2}')`;
      this.opacity = this.sankey_plot_object.default_gradient_links_opacity;
    } else if (typeof color === "string") {
      // Use provided color as solid fill
      this.fill = color;
      this.opacity = this.sublink_data
        ? this.sankey_plot_object.default_sublinks_opacity
        : this.sankey_plot_object.default_links_opacity;
    } else {
      // Use default color if no color is provided
      this.fill = this.sublink_data
        ? this.sankey_plot_object.default_sublinks_color
        : this.sankey_plot_object.default_links_color;
      this.opacity = this.sublink_data
        ? this.sankey_plot_object.default_sublinks_opacity
        : this.sankey_plot_object.default_links_opacity;
    }
  }

  protected createDomElement(): void {
    this.dom_node = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    this.setAttributes(this.dom_node, {
      identifier: "SankeyLink",
      links_array_id: this.links_array_index,
      fill: this.fill!,
      "fill-opacity": this.opacity!,
      d: this.calculateD(
        this.node1.original_x,
        this.node2.original_x,
        this.node1.original_y + this.node1_render_height,
        this.node2.original_y + this.node2_render_height,
        this.height,
        this.node1.width,
        this.node2.width,
      ),
    });
    if (this.sublink_data) {
      this.dom_node.setAttribute(
        "sublink_index",
        this.sublink_index!.toString(),
      );
    }
    this.sankey_plot_object.dom_node.appendChild(this.dom_node);
  }

  private setAttributes(
    element: Element,
    attributes: Record<string, string | number>,
  ): void {
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, value.toString());
    }
  }
}

export class SankeyLinkRL extends SankeyLink {
  constructor(
    node1: any,
    node2: any,
    height: number,
    sankey_plot_object: any,
    links_array_index: number,
    color: string | undefined = undefined,
    sublink_data: any = undefined,
  ) {
    super(
      node1,
      node2,
      height,
      sankey_plot_object,
      links_array_index,
      color,
      sublink_data,
    );
    this.createDomElement();
  }

  protected calculateD(
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    path_height: number,
    node1_width: number,
    node2_width: number,
  ): string {
    // Ensure all values are numbers
    x1 = Number(x1);
    x2 = Number(x2);
    y1 = Number(y1);
    y2 = Number(y2);
    path_height = Number(path_height);
    node1_width = Number(node1_width);
    node2_width = Number(node2_width);

    // Check if any value is NaN
    if ([x1, x2, y1, y2, path_height, node1_width, node2_width].some(isNaN)) {
      console.error("Invalid numerical values in link calculation", {
        x1,
        x2,
        y1,
        y2,
        path_height,
        node1_width,
        node2_width,
      });
      return ""; // Return an empty path if any value is invalid
    }

    let half_way_x = (x1 + node1_width + x2) / 2;
    return `M ${x1 + node1_width} ${y1} C ${half_way_x} ${y1}, ${half_way_x} ${y2},
      ${x2} ${y2} l 0 ${path_height} C ${half_way_x} ${y2 + path_height},
      ${half_way_x} ${y1 + path_height}, ${x1 + node1_width} ${y1 + path_height} Z`;
  }
}

export class SankeyLinkLR extends SankeyLink {
  private left_side_curve: number;
  private right_side_curve: number;

  constructor(
    node1: any,
    node2: any,
    height: number,
    sankey_plot_object: any,
    links_array_index: number,
    color: string | undefined = undefined,
    sublink_data: any = undefined,
  ) {
    super(
      node1,
      node2,
      height,
      sankey_plot_object,
      links_array_index,
      color,
      sublink_data,
    );
    this.left_side_curve =
      this.sankey_plot_object.links_data[this.links_array_index][
        "left_side_curve"
      ];
    this.right_side_curve =
      this.sankey_plot_object.links_data[this.links_array_index][
        "right_side_curve"
      ];
    if (this.sublink_data) {
      this.left_side_curve +=
        this.parent_link_height! * (1 - this.sublink_data["shift"]) -
        this.height;
      this.right_side_curve +=
        this.parent_link_height! * (1 - this.sublink_data["shift"]) -
        this.height;
    }
    this.createDomElement();
  }

  protected calculateD(
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    path_height: number,
    node1_width: number,
    node2_width: number,
  ): string {
    // Ensure all values are numbers
    x1 = Number(x1);
    x2 = Number(x2);
    y1 = Number(y1);
    y2 = Number(y2);
    path_height = Number(path_height);
    node1_width = Number(node1_width);
    node2_width = Number(node2_width);

    // Check if any value is NaN
    if ([x1, x2, y1, y2, path_height, node1_width, node2_width].some(isNaN)) {
      console.error("Invalid numerical values in link calculation", {
        x1,
        x2,
        y1,
        y2,
        path_height,
        node1_width,
        node2_width,
      });
      return ""; // Return an empty path if any value is invalid
    }

    let node_tail = 0;
    let arc_curve_left = this.left_side_curve;
    let arc_curve_right = this.right_side_curve;
    let falldown = 0;
    let half_way_x = (x1 + x2 + node2_width) / 2;
    return `M ${x1} ${y1 + path_height} l -${node_tail} 0 a ${arc_curve_left} ${arc_curve_left} 0, 0, 0,
     -${arc_curve_left} ${arc_curve_left} l 0 ${falldown}
    a ${arc_curve_left} ${arc_curve_left} 0, 0, 0, ${arc_curve_left} ${arc_curve_left}
    C ${half_way_x} ${y1 + path_height + 2 * arc_curve_left + falldown}, ${half_way_x}
    ${y2 + path_height + 2 * arc_curve_right + falldown}, ${x2 + node2_width} ${y2 + path_height + 2 * arc_curve_right + falldown}
    l ${node_tail} 0 a ${arc_curve_right}, ${arc_curve_right}, 0, 0, 0,
    ${arc_curve_right} -${arc_curve_right} l 0 -${falldown}
    a ${arc_curve_right}, ${arc_curve_right},
    0, 0, 0, -${arc_curve_right} -${arc_curve_right} l -${node_tail} 0 l 0 -${path_height} l ${node_tail} 0
    a ${path_height + arc_curve_right} ${path_height + arc_curve_right}, 0, 0, 1,
    ${path_height + arc_curve_right}, ${path_height + arc_curve_right} l 0 ${falldown}
    a ${path_height + arc_curve_right} ${path_height + arc_curve_right}, 0, 0, 1,
    -${path_height + arc_curve_right}, ${path_height + arc_curve_right} l -${node_tail} 0
    C ${half_way_x} ${y2 + 2 * path_height + 2 * arc_curve_right + falldown}, ${half_way_x} ${y1 + 2 * path_height + 2 * arc_curve_left + falldown},
     ${x1} ${y1 + 2 * path_height + 2 * arc_curve_left + falldown} l -${node_tail} 0
    a ${path_height + arc_curve_left} ${path_height + arc_curve_left}, 0, 0, 1,
    -${path_height + arc_curve_left}, -${path_height + arc_curve_left} l 0 ${-falldown}
    a ${path_height + arc_curve_left} ${path_height + arc_curve_left}, 0, 0, 1,
    ${path_height + arc_curve_left}, -${path_height + arc_curve_left} l ${node_tail} 0 Z`;
  }
}

export class SankeyLinkLL extends SankeyLink {
  private left_side_curve: number;

  constructor(
    node1: any,
    node2: any,
    height: number,
    sankey_plot_object: any,
    links_array_index: number,
    color: string | undefined = undefined,
    sublink_data: any = undefined,
  ) {
    super(
      node1,
      node2,
      height,
      sankey_plot_object,
      links_array_index,
      color,
      sublink_data,
    );
    this.left_side_curve =
      this.sankey_plot_object.links_data[this.links_array_index][
        "left_side_curve"
      ];
    if (this.sublink_data) {
      this.left_side_curve +=
        this.parent_link_height! * (1 - this.sublink_data["shift"]) -
        this.height;
    }
    this.createDomElement();
  }

  protected calculateD(
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    path_height: number,
    node1_width: number,
    node2_width: number,
  ): string {
    // Ensure all values are numbers
    x1 = Number(x1);
    x2 = Number(x2);
    y1 = Number(y1);
    y2 = Number(y2);
    path_height = Number(path_height);
    node1_width = Number(node1_width);
    node2_width = Number(node2_width);

    // Check if any value is NaN
    if ([x1, x2, y1, y2, path_height, node1_width, node2_width].some(isNaN)) {
      console.error("Invalid numerical values in link calculation", {
        x1,
        x2,
        y1,
        y2,
        path_height,
        node1_width,
        node2_width,
      });
      return ""; // Return an empty path if any value is invalid
    }

    let node_tail = 0;
    let arc_curve_distance = this.left_side_curve;
    let falldown = 0;
    let half_way_x = (x1 + x2) / 2;
    return `M ${x1} ${y1 + path_height} l -${node_tail} 0 a ${arc_curve_distance} ${arc_curve_distance} 0, 0, 0,
     -${arc_curve_distance} ${arc_curve_distance} l 0 ${falldown}
    a ${arc_curve_distance} ${arc_curve_distance} 0, 0, 0, ${arc_curve_distance} ${arc_curve_distance} l ${node_tail} 0
    C ${half_way_x} ${y1 + path_height + 2 * arc_curve_distance + falldown}, ${half_way_x}
    ${y2}, ${x2} ${y2} l 0 ${path_height} C ${half_way_x} ${y2 + path_height}, ${half_way_x}
    ${y1 + 2 * path_height + 2 * arc_curve_distance + falldown}, ${x1} ${y1 + 2 * path_height + 2 * arc_curve_distance + falldown} l -${node_tail} 0
    a ${path_height + arc_curve_distance} ${path_height + arc_curve_distance}, 0, 0, 1,
    -${path_height + arc_curve_distance}, -${path_height + arc_curve_distance} l 0 ${-falldown}
    a ${path_height + arc_curve_distance} ${path_height + arc_curve_distance}, 0, 0, 1,
    ${path_height + arc_curve_distance}, -${path_height + arc_curve_distance} l ${node_tail} 0 Z`;
  }
}

export class SankeyLinkRR extends SankeyLink {
  private right_side_curve: number;

  constructor(
    node1: any,
    node2: any,
    height: number,
    sankey_plot_object: any,
    links_array_index: number,
    color: string | undefined = undefined,
    sublink_data: any = undefined,
  ) {
    super(
      node1,
      node2,
      height,
      sankey_plot_object,
      links_array_index,
      color,
      sublink_data,
    );
    this.right_side_curve =
      this.sankey_plot_object.links_data[this.links_array_index][
        "right_side_curve"
      ];
    if (this.sublink_data) {
      this.right_side_curve +=
        this.parent_link_height! * (1 - this.sublink_data["shift"]) -
        this.height;
    }
    this.createDomElement();
  }

  protected calculateD(
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    path_height: number,
    node1_width: number,
    node2_width: number,
  ): string {
    // Ensure all values are numbers
    x1 = Number(x1);
    x2 = Number(x2);
    y1 = Number(y1);
    y2 = Number(y2);
    path_height = Number(path_height);
    node1_width = Number(node1_width);
    node2_width = Number(node2_width);

    // Check if any value is NaN
    if ([x1, x2, y1, y2, path_height, node1_width, node2_width].some(isNaN)) {
      console.error("Invalid numerical values in link calculation", {
        x1,
        x2,
        y1,
        y2,
        path_height,
        node1_width,
        node2_width,
      });
      return ""; // Return an empty path if any value is invalid
    }

    let node_tail = 0;
    let arc_curve_distance = this.right_side_curve;
    let falldown = 0;
    let half_way_x = (x1 + x2 + node1_width + node2_width) / 2;
    return `M ${x1 + node1_width} ${y1} C ${half_way_x} ${y1}, ${half_way_x}
    ${y2 + path_height + 2 * arc_curve_distance + falldown}, ${x2 + node2_width} ${y2 + path_height + 2 * arc_curve_distance + falldown}
    l ${node_tail} 0 a ${arc_curve_distance}, ${arc_curve_distance}, 0, 0, 0,
    ${arc_curve_distance} -${arc_curve_distance} l 0 -${falldown} a ${arc_curve_distance}, ${arc_curve_distance},
    0, 0, 0, -${arc_curve_distance} -${arc_curve_distance} l -${node_tail} 0 l 0 -${path_height} l ${node_tail} 0
    a ${path_height + arc_curve_distance} ${path_height + arc_curve_distance}, 0, 0, 1,
    ${path_height + arc_curve_distance}, ${path_height + arc_curve_distance} l 0 ${falldown}
    a ${path_height + arc_curve_distance} ${path_height + arc_curve_distance}, 0, 0, 1,
    -${path_height + arc_curve_distance}, ${path_height + arc_curve_distance} l -${node_tail} 0
    C ${half_way_x} ${y2 + 2 * path_height + 2 * arc_curve_distance + falldown}, ${half_way_x} ${y1 + path_height},
     ${x1 + node1_width} ${y1 + path_height} Z`;
  }
}
