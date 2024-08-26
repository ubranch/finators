import { SankeyNode } from "./SankeyNode";
import {
  SankeyLinkRL,
  SankeyLinkLR,
  SankeyLinkLL,
  SankeyLinkRR,
} from "./SankeyLinks";

import {
  SVGLineAttributes,
  defaultLineAttributes,
  ColumnNamesStyle,
} from "./types";

export class SankeyPlot {
  public dom_node!: SVGSVGElement;
  private dom_container: HTMLElement;
  private nodes_data_structure: any[];
  private links_data: any[];
  private plot_width: number;
  private plot_height: number;
  private nodes_width_percent: number;
  private first_column: number;
  private last_column: number;
  private selected_node: SankeyNode | undefined;
  private node_height_unit: number;
  private longest_link_length: number;
  private last_column_width: number;
  private column_width: number;
  private node_move_x: boolean;
  private node_move_y: boolean;
  private linear_gradient_links: boolean;
  private link_arc_iterated_increase: number;
  private label_colors_object: Record<string, string>;
  private plot_background_color: string;
  private default_links_color: string;
  private default_links_opacity: number;
  private default_gradient_links_opacity: number;
  private default_sublinks_color: string;
  private default_sublinks_opacity: number;
  private line_definition_object: Required<SVGLineAttributes>;
  private column_names: string[] | undefined;
  private column_names_style: ColumnNamesStyle;
  private default_nodes_color: string;
  private start_node_count_from: number;
  private start_column_count_from: number;
  private show_links_out_of_range: boolean;
  private on_node_click_function:
    | ((
        node_info: any,
        node_data_reference: any,
        node_element: SVGElement,
        event: MouseEvent,
      ) => void)
    | undefined;
  private on_link_click_function:
    | ((
        link_info: any,
        link_data_reference: any,
        link_element: SVGElement,
        event: MouseEvent,
      ) => void)
    | undefined;
  private on_node_hover_function: (
    node_info: any,
    node_data_reference: any,
    node_element: SVGElement,
    event: MouseEvent,
  ) => string;
  private on_link_hover_function: (
    link_info: any,
    link_data_reference: any,
    link_element: SVGElement,
    event: MouseEvent,
  ) => string;
  private hover_node_cursor: string;
  private hover_link_cursor: string;
  private grabbing_node_cursor: string;
  private node_info_div: HTMLDivElement | undefined;
  private mouseovered_node: SankeyNode | undefined;
  private link_info_div: HTMLDivElement | undefined;
  private mouseovered_link: SVGPathElement | undefined;
  private defs: SVGDefsElement | null = null;
  private nodes: Record<number, Record<number, SankeyNode>> = {};
  private linear_gradient_colors_object: Record<
    string,
    Record<string, boolean>
  >;
  private links_to_create_indexes: number[] | null = null;

  private readonly BORDER_PADDING = 10;

  constructor(
    dom_container: HTMLElement,
    nodes_data: any[],
    links_data: any[],
    plot_width: number,
    plot_height: number,
    nodes_width_percent: number,
    first_column: number,
    last_column: number,
    node_height_unit: number,
    longest_link_length: number,
    last_column_width: number,
    show_column_lines: boolean = true,
    show_column_names: boolean = true,
    node_move_x: boolean = false,
    node_move_y: boolean = true,
    linear_gradient_links: boolean = true,
    link_arc_iterated_increase: number = 5,
    label_colors_object: Record<string, string> = {},
    plot_background_color: string = "#f5ecec",
    default_links_color: string = "blue",
    default_links_opacity: number = 0.25,
    default_gradient_links_opacity: number = 0.43,
    default_sublinks_color: string = "red",
    default_sublinks_opacity: number = 0.8,
    line_definition_object: SVGLineAttributes = {},

    column_names: string[] | undefined = undefined,
    column_names_style: ColumnNamesStyle = {
      "font-size": "15px",
      color: "red",
      opacity: "0.50",
      "font-weight": "bold",
    },
    default_nodes_color: string = "grey",
    start_node_count_from: number = 0,
    start_column_count_from: number = 0,
    show_links_out_of_range: boolean = true,
    on_node_click_function:
      | ((
          node_info: any,
          node_data_reference: any,
          node_element: SVGElement,
          event: MouseEvent,
        ) => void)
      | undefined = undefined,
    on_link_click_function:
      | ((
          link_info: any,
          link_data_reference: any,
          link_element: SVGElement,
          event: MouseEvent,
        ) => void)
      | undefined = undefined,
    on_node_hover_function: (
      node_info: any,
      node_data_reference: any,
      node_element: SVGElement,
      event: MouseEvent,
    ) => string = (node_info) => `${node_info["label"]}`,
    on_link_hover_function: (
      link_info: any,
      link_data_reference: any,
      link_element: SVGElement,
      event: MouseEvent,
    ) => string = (link_info) =>
      `From: (column - ${link_info["from_column"]}, node - ${link_info["from_node"]}, label - "${link_info["from_label"]}") To: (column - ${link_info["to_column"]}, node - ${link_info["to_node"]}, label - "${link_info["to_label"]}") Value: ${link_info["value"]}`,
    hover_node_cursor: string = "pointer",
    hover_link_cursor: string = "help",
    grabbing_node_cursor: string = "grabbing",
  ) {
    this.nodes = {}; // Initialize this.nodes in the constructor
    this.dom_node = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    this.defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    this.dom_node.appendChild(this.defs);
    this.dom_container = dom_container;
    this.nodes_data_structure = nodes_data;
    this.links_data = links_data;
    this.plot_width = plot_width;
    this.plot_height = plot_height;
    this.nodes_width_percent = nodes_width_percent;
    this.first_column = first_column;
    this.last_column = last_column;
    this.selected_node = undefined;
    this.node_height_unit = node_height_unit;
    this.longest_link_length = longest_link_length;
    this.last_column_width = last_column_width;
    this.column_width =
      this.plot_width / (this.last_column - this.first_column);
    this.node_move_x = node_move_x;
    this.node_move_y = node_move_y;
    this.linear_gradient_links = linear_gradient_links;
    this.link_arc_iterated_increase = link_arc_iterated_increase;
    this.label_colors_object = label_colors_object;
    this.plot_background_color = plot_background_color;
    this.default_links_color = default_links_color;
    this.default_links_opacity = default_links_opacity;
    this.default_gradient_links_opacity = default_gradient_links_opacity;
    this.default_sublinks_color = default_sublinks_color;
    this.default_sublinks_opacity = default_sublinks_opacity;
    this.line_definition_object = {
      ...defaultLineAttributes,
      ...line_definition_object,
    };
    this.column_names = column_names;
    this.column_names_style = column_names_style;
    this.default_nodes_color = default_nodes_color;
    this.start_node_count_from = start_node_count_from;
    this.start_column_count_from = start_column_count_from;
    this.show_links_out_of_range = show_links_out_of_range;
    this.on_node_click_function = on_node_click_function;
    this.on_link_click_function = on_link_click_function;
    this.on_node_hover_function = on_node_hover_function;
    this.on_link_hover_function = on_link_hover_function;
    this.hover_node_cursor = hover_node_cursor;
    this.hover_link_cursor = hover_link_cursor;
    this.grabbing_node_cursor = grabbing_node_cursor;
    this.node_info_div = undefined;
    this.mouseovered_node = undefined;
    this.link_info_div = undefined;
    this.mouseovered_link = undefined;
    this.links_to_create_indexes = [];

    this.createDomNode();
    this.addEventListeners();
    if (show_column_lines) {
      this.createLines();
    }
    if (show_column_names) {
      this.createColumnNames();
    }
    this.linear_gradient_colors_object = {};
    this.createNodes();
    this.createLinks();
  }

  public getPlotWidth(): number {
    return this.plot_width;
  }

  public getPlotHeight(): number {
    return this.plot_height;
  }

  private createDomNode(): void {
    this.dom_node = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    this.defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    this.dom_node.appendChild(this.defs);
    this.setAttributes(this.dom_node, {
      width: this.plot_width,
      height: this.plot_height,
      id: "sankey_field",
      viewBox: `0 0 ${this.plot_width} ${this.plot_height}`,
    });
    this.dom_node.style.backgroundColor = this.plot_background_color;
    this.dom_container.style.overflow = "hidden";
    this.dom_container.appendChild(this.dom_node);
  }

  private addEventListeners(): void {
    if (this.dom_node) {
      this.dom_node.addEventListener("click", (e: MouseEvent) => {
        const target = e.target as SVGElement;
        if (target.getAttribute("identifier") === "SankeyNode") {
          if (this.on_node_click_function) {
            const column = target.getAttribute("column");
            const position = target.getAttribute("position");

            if (column !== null && position !== null) {
              const columnIndex = parseInt(column);
              const positionIndex = parseInt(position);

              if (
                this.nodes[columnIndex] &&
                this.nodes[columnIndex][positionIndex]
              ) {
                const selected_node = this.nodes[columnIndex][positionIndex];
                const node_data =
                  this.nodes_data_structure[selected_node.column][
                    selected_node.position
                  ]["properties_object"];
                this.on_node_click_function(
                  this.getNodeInfo(e),
                  node_data,
                  target,
                  e,
                );
              } else {
                console.error("Node not found for given column and position");
              }
            } else {
              console.error("Column or position attribute is missing");
            }
          }
        }
        if (target.getAttribute("identifier") === "SankeyLink") {
          if (this.on_link_click_function) {
            const link_div = target;
            const link_data =
              this.links_data[parseInt(target.getAttribute("links_array_id")!)];
            this.on_link_click_function(
              this.getLinkInfo(e),
              link_data,
              link_div,
              e,
            );
          }
        }
      });

      this.dom_node.addEventListener("pointerdown", (e: PointerEvent) => {
        const target = e.target as SVGElement;
        if (target.getAttribute("identifier") === "SankeyNode") {
          if (this.node_info_div) {
            this.dom_container.removeChild(this.node_info_div);
            this.node_info_div = undefined;
          }
          const column = target.getAttribute("column");
          const position = target.getAttribute("position");
          if (column !== null && position !== null) {
            const columnIndex = parseInt(column);
            const positionIndex = parseInt(position);
            if (
              this.nodes[columnIndex] &&
              this.nodes[columnIndex][positionIndex]
            ) {
              this.selected_node = this.nodes[columnIndex][positionIndex];
              this.selected_node.mouse_locked = true;
              this.selected_node.dom_rectangle.classList.add(
                "focused_SankeyNode",
              );
              this.dom_node.style.cursor = this.grabbing_node_cursor;
            }
          }
        }
      });

      this.dom_node.addEventListener("pointermove", (e: PointerEvent) => {
        if (this.selected_node && this.selected_node.mouse_locked) {
          this.selected_node.move(
            e.clientX,
            e.clientY - this.dom_node.getBoundingClientRect().top,
          );
        }
      });

      this.dom_node.addEventListener("pointerup", () => {
        if (this.selected_node) {
          this.selected_node.mouse_locked = false;
          this.selected_node.dom_rectangle.classList.remove(
            "focused_SankeyNode",
          );
          this.selected_node = undefined;
          this.dom_node.style.removeProperty("cursor");
        }
      });

      this.dom_node.addEventListener("pointerover", (e: PointerEvent) => {
        const target = e.target as SVGElement;
        if (target.getAttribute("identifier") === "SankeyNode") {
          if (!this.selected_node) {
            this.dom_node.style.cursor = this.hover_node_cursor;
            const column = target.getAttribute("column");
            const position = target.getAttribute("position");
            if (column !== null && position !== null) {
              const columnIndex = parseInt(column);
              const positionIndex = parseInt(position);
              if (
                this.nodes[columnIndex] &&
                this.nodes[columnIndex][positionIndex]
              ) {
                this.mouseovered_node = this.nodes[columnIndex][positionIndex];

                let text_content = undefined;
                if (this.on_node_hover_function) {
                  const div_ = target;
                  const snode_ =
                    this.nodes[parseInt(div_.getAttribute("column")!)][
                      parseInt(div_.getAttribute("position")!)
                    ];
                  const node_d_ =
                    this.nodes_data_structure[snode_.column][snode_.position][
                      "properties_object"
                    ];
                  text_content = this.on_node_hover_function(
                    this.getNodeInfo(e),
                    node_d_,
                    div_,
                    e,
                  );
                }

                const node_info_div = document.createElement("div");
                node_info_div.classList.add("node_info_div");
                node_info_div.innerHTML = text_content || "";
                this.dom_container.appendChild(node_info_div);

                const potential_y_coord = Math.max(
                  this.mouseovered_node.current_y -
                    node_info_div.offsetHeight +
                    this.dom_container.getBoundingClientRect().top -
                    5,
                  0,
                );
                let potential_x_coord = Math.max(
                  this.mouseovered_node.current_x +
                    this.dom_container.getBoundingClientRect().left +
                    (this.mouseovered_node.width - node_info_div.offsetWidth) /
                      2,
                  0,
                );
                if (potential_y_coord === 0) {
                  potential_x_coord += node_info_div.offsetWidth;
                }
                node_info_div.style.top = `${potential_y_coord}px`;
                node_info_div.style.left = `${potential_x_coord}px`;
                this.node_info_div = node_info_div;
              }
            }
          }
        } else if (target.getAttribute("identifier") === "SankeyLink") {
          if (!this.selected_node) {
            this.dom_node.style.cursor = this.hover_link_cursor;
            this.mouseovered_link = target as SVGPathElement;
            this.mouseovered_link.classList.add("hovered_SankeyLink");

            let text_content = undefined;
            if (this.on_link_hover_function) {
              const link_div = target;
              const link_data =
                this.links_data[
                  parseInt(target.getAttribute("links_array_id")!)
                ];
              text_content = this.on_link_hover_function(
                this.getLinkInfo(e),
                link_data,
                link_div,
                e,
              );
            }

            const link_info_div = document.createElement("div");
            link_info_div.classList.add("link_info_div");
            link_info_div.innerHTML = text_content || "";

            this.dom_container.appendChild(link_info_div);
            const potential_y_coord = Math.max(
              e.clientY - link_info_div.offsetHeight - 15,
              0,
            );
            const potential_x_coord = Math.max(e.clientX + 15, 0);
            link_info_div.style.top = `${potential_y_coord}px`;
            link_info_div.style.left = `${potential_x_coord}px`;
            this.link_info_div = link_info_div;
          }
        }
      });

      this.dom_node.addEventListener("pointerout", (e: PointerEvent) => {
        const target = e.target as SVGElement;
        if (target.getAttribute("identifier") === "SankeyNode") {
          if (!this.selected_node) {
            this.dom_node.style.removeProperty("cursor");
          }
          if (this.node_info_div) {
            this.dom_container.removeChild(this.node_info_div);
            this.node_info_div = undefined;
          }
        } else if (target.getAttribute("identifier") === "SankeyLink") {
          if (!this.selected_node) {
            this.dom_node.style.removeProperty("cursor");
          }
          if (this.link_info_div) {
            this.mouseovered_link!.classList.remove("hovered_SankeyLink");
            this.dom_container.removeChild(this.link_info_div);
            this.link_info_div = undefined;
          }
        }
      });
    } else {
      console.error("DOM node is not initialized");
    }
  }

  private createLines(): void {
    for (let i = 0; i < this.last_column - this.first_column - 1; i++) {
      let line = document.createElementNS("http://www.w3.org/2000/svg", "line");

      const attributes: Record<string, string | number> = {
        x1: this.column_width * (i + 1),
        x2: this.column_width * (i + 1),
        y1: 0,
        y2: this.plot_height,
      };

      // Ensure all values are string or number
      if (this.line_definition_object.stroke || defaultLineAttributes.stroke) {
        attributes.stroke =
          this.line_definition_object.stroke || defaultLineAttributes.stroke;
      }
      if (
        this.line_definition_object["stroke-width"] ||
        defaultLineAttributes["stroke-width"]
      ) {
        attributes["stroke-width"] =
          this.line_definition_object["stroke-width"] ||
          defaultLineAttributes["stroke-width"];
      }
      if (
        this.line_definition_object["stroke-opacity"] ||
        defaultLineAttributes["stroke-opacity"]
      ) {
        attributes["stroke-opacity"] =
          this.line_definition_object["stroke-opacity"] ||
          defaultLineAttributes["stroke-opacity"];
      }
      if (
        this.line_definition_object["stroke-dasharray"] ||
        defaultLineAttributes["stroke-dasharray"]
      ) {
        attributes["stroke-dasharray"] =
          this.line_definition_object["stroke-dasharray"] ||
          defaultLineAttributes["stroke-dasharray"];
      }

      this.setAttributes(line, attributes);
      this.dom_node.appendChild(line);
    }
  }

  private createColumnNames(): void {
    for (let i = 0; i < this.last_column - this.first_column; i++) {
      let number = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text",
      );
      if (this.column_names) {
        number.textContent = this.column_names[i + this.first_column];
      } else {
        number.textContent = (
          i +
          this.first_column +
          this.start_column_count_from
        ).toString();
      }
      this.setAttributes(number, {
        x: this.column_width / 2 + i * this.column_width,
        y: 10,
        "text-anchor": "middle",
        "dominant-baseline": "hanging",
        style: `font-size:${this.column_names_style["font-size"]};fill:${this.column_names_style["color"]};
        opacity:${this.column_names_style["opacity"]};font-weight:${this.column_names_style["font-weight"]}`,
      });
      this.dom_node.appendChild(number);
    }
  }

  private createNodes(): void {
    let out_of_column_range_nodes: { column: number; position: number }[] = [];
    this.links_to_create_indexes = [];
    for (
      let column_index = this.first_column;
      column_index < this.last_column;
      column_index++
    ) {
      for (let node_index in this.nodes_data_structure[column_index]) {
        for (let link_index in this.nodes_data_structure[column_index][
          node_index
        ]["links_references"]) {
          let link_ref =
            this.nodes_data_structure[column_index][node_index][
              "links_references"
            ][link_index];
          this.links_to_create_indexes.push(link_ref["link_id"]);
          if (
            link_ref["second_node_column"] < this.first_column ||
            link_ref["second_node_column"] >= this.last_column
          ) {
            out_of_column_range_nodes.push({
              column: link_ref["second_node_column"],
              position: link_ref["second_node_position"],
            });
          }
        }
      }
    }

    if (this.show_links_out_of_range) {
      let number_of_columns = this.nodes_data_structure.length;
      let check_range =
        number_of_columns - this.last_column > this.first_column
          ? [
              Math.max(this.first_column - this.longest_link_length, 0),
              this.first_column,
            ]
          : [
              this.last_column,
              Math.min(
                this.last_column + this.longest_link_length,
                number_of_columns,
              ),
            ];

      for (
        let column_index = check_range[0];
        column_index < check_range[1];
        column_index++
      ) {
        for (let node_index in this.nodes_data_structure[column_index]) {
          for (let link_index in this.nodes_data_structure[column_index][
            node_index
          ]["links_references"]) {
            let link_ref =
              this.nodes_data_structure[column_index][node_index][
                "links_references"
              ][link_index];
            if (
              link_ref["second_node_column"] < this.first_column ||
              link_ref["second_node_column"] >= this.last_column
            ) {
              out_of_column_range_nodes.push({
                column: link_ref["second_node_column"],
                position: link_ref["second_node_position"],
              });
              this.links_to_create_indexes.push(link_ref["link_id"]);
            }
          }
        }
      }
    }

    this.links_to_create_indexes = this.links_to_create_indexes.filter(
      (value, index, self) => self.indexOf(value) === index,
    );

    for (
      let column_index = this.first_column;
      column_index < this.last_column;
      column_index++
    ) {
      this.nodes[column_index] = this.nodes[column_index] || {};
      for (
        let node_index = 0;
        node_index < this.nodes_data_structure[column_index].length;
        node_index++
      ) {
        let node = this.nodes_data_structure[column_index][node_index];
        let label = node["properties_object"].hasOwnProperty("label")
          ? node["properties_object"]["label"]
          : "";
        let color = this.default_nodes_color;
        if (this.label_colors_object.hasOwnProperty(label)) {
          color = this.label_colors_object[label];
        }
        if (node["properties_object"].hasOwnProperty("color")) {
          color = node["properties_object"]["color"];
        }
        let width = node["properties_object"].hasOwnProperty("width")
          ? this.column_width * parseFloat(node["properties_object"]["width"])
          : this.column_width * this.nodes_width_percent;

        let x = Math.max(
          this.BORDER_PADDING,
          Math.min(
            (column_index - this.first_column) * this.column_width +
              (this.column_width - width) / 2 +
              node["horizontal_shift"] *
                (this.column_width / this.last_column_width),
            this.plot_width - width - this.BORDER_PADDING,
          ),
        );

        let y = Math.max(
          this.BORDER_PADDING,
          Math.min(
            node["y"] + node["vertical_shift"],
            this.plot_height - node["height"] - this.BORDER_PADDING,
          ),
        );

        this.nodes[column_index][node_index] = new SankeyNode(
          x,
          y,
          width,
          node["height"],
          this,
          column_index,
          node_index,
          color,
          label,
          node["properties_object"],
        );
      }
    }

    for (let i in out_of_column_range_nodes) {
      let column = out_of_column_range_nodes[i]["column"];
      let position = out_of_column_range_nodes[i]["position"];
      this.nodes[column] = this.nodes[column] || {};
      let node = this.nodes_data_structure[column][position];
      let label = node["properties_object"].hasOwnProperty("label")
        ? node["properties_object"]["label"]
        : "";
      let color = this.default_nodes_color;
      if (this.label_colors_object.hasOwnProperty(label)) {
        color = this.label_colors_object[label];
      }
      if (node["properties_object"].hasOwnProperty("color")) {
        color = node["properties_object"]["color"];
      }
      let width = node["properties_object"].hasOwnProperty("width")
        ? this.column_width * parseFloat(node["properties_object"]["width"])
        : this.column_width * this.nodes_width_percent;

      let x = Math.max(
        this.BORDER_PADDING,
        Math.min(
          (column - this.first_column) * this.column_width +
            (this.column_width - width) / 2 +
            node["horizontal_shift"] *
              (this.column_width / this.last_column_width),
          this.plot_width - width - this.BORDER_PADDING,
        ),
      );

      let y = Math.max(
        this.BORDER_PADDING,
        Math.min(
          node["y"] + node["vertical_shift"],
          this.plot_height - node["height"] - this.BORDER_PADDING,
        ),
      );

      this.nodes[column][position] = new SankeyNode(
        x,
        y,
        width,
        node["height"],
        this,
        column,
        position,
        color,
        label,
        node["properties_object"],
      );
    }
  }

  private createLinks(): void {
    if (!this.links_to_create_indexes) {
      console.error("links_to_create_indexes is not initialized");
      return;
    }

    this.links_to_create_indexes.sort((a, b) => a - b);
    for (let i in this.links_to_create_indexes) {
      let link = this.links_data[this.links_to_create_indexes[i]];
      let link_type = link.hasOwnProperty("link_type")
        ? link["link_type"]
        : "RL";
      let start_node = this.nodes[link["from"]["column"]][link["from"]["node"]];
      let end_node = this.nodes[link["to"]["column"]][link["to"]["node"]];
      let height = link["value"] * this.node_height_unit;
      let link_color = link.hasOwnProperty("color") ? link["color"] : undefined;
      switch (link_type) {
        case "RL":
          new SankeyLinkRL(
            start_node,
            end_node,
            height,
            this,
            this.links_to_create_indexes[i],
            link_color,
          );
          break;
        case "LR":
          new SankeyLinkLR(
            start_node,
            end_node,
            height,
            this,
            this.links_to_create_indexes[i],
            link_color,
          );
          break;
        case "LL":
          new SankeyLinkLL(
            start_node,
            end_node,
            height,
            this,
            this.links_to_create_indexes[i],
            link_color,
          );
          break;
        case "RR":
          new SankeyLinkRR(
            start_node,
            end_node,
            height,
            this,
            this.links_to_create_indexes[i],
            link_color,
          );
          break;
        default:
          throw new Error("NOT A VALID LINK TYPE");
      }

      if (link.hasOwnProperty("sublinks")) {
        for (let sublink_index in link["sublinks"]) {
          let sublink_data = link["sublinks"][sublink_index];
          link_color = sublink_data.hasOwnProperty("color")
            ? sublink_data["color"]
            : undefined;
          switch (link_type) {
            case "RL":
              new SankeyLinkRL(
                start_node,
                end_node,
                height,
                this,
                this.links_to_create_indexes[i],
                link_color,
                [sublink_data, parseInt(sublink_index)],
              );
              break;
            case "LR":
              new SankeyLinkLR(
                start_node,
                end_node,
                height,
                this,
                this.links_to_create_indexes[i],
                link_color,
                [sublink_data, parseInt(sublink_index)],
              );
              break;
            case "LL":
              new SankeyLinkLL(
                start_node,
                end_node,
                height,
                this,
                this.links_to_create_indexes[i],
                link_color,
                [sublink_data, parseInt(sublink_index)],
              );
              break;
            case "RR":
              new SankeyLinkRR(
                start_node,
                end_node,
                height,
                this,
                this.links_to_create_indexes[i],
                link_color,
                [sublink_data, parseInt(sublink_index)],
              );
              break;
            default:
              throw new Error("NOT A VALID LINK TYPE");
          }
        }
      }
    }

    for (let i in this.nodes) {
      for (let j in this.nodes[i]) {
        this.nodes[i][j].redraw();
      }
    }
  }

  public clearData(): void {
    this.nodes_data_structure = undefined as any;
    this.links_data = undefined as any;
    this.column_names = undefined;
    this.nodes = undefined as any;
    if (this.defs && this.defs.parentNode) {
      this.defs.parentNode.removeChild(this.defs);
    }
    this.defs = undefined as any;
  }

  private setAttributes(
    element: SVGElement,
    attributes: Record<string, string | number>,
  ): void {
    Object.entries(attributes).forEach(([key, value]) => {
      if (value !== undefined) {
        element.setAttribute(key, value.toString());
      }
    });
  }

  private getNodeInfo(e: MouseEvent): any {
    const target = e.target as SVGElement;
    const column = target.getAttribute("column");
    const position = target.getAttribute("position");

    if (column !== null && position !== null) {
      const columnIndex = parseInt(column);
      const positionIndex = parseInt(position);

      if (this.nodes[columnIndex] && this.nodes[columnIndex][positionIndex]) {
        const selected_node = this.nodes[columnIndex][positionIndex];
        let node_column = selected_node.column;
        let node_position = selected_node.position;
        let node_data = this.nodes_data_structure[node_column][node_position];
        let node_label = selected_node.label;
        let node_height = Math.max(
          node_data["left_side_sum"],
          node_data["right_side_sum"],
        );
        let number_of_links = node_data["links_references"].length;
        let left_side_sum = node_data["left_side_sum"];
        let right_side_sum = node_data["right_side_sum"];

        let number_of_links_left = 0;
        let number_of_links_right = 0;
        for (let i in node_data["links_references"]) {
          let link =
            this.links_data[node_data["links_references"][i]["link_id"]];
          let second_node_col =
            node_data["links_references"][i]["second_node_column"];
          if (node_column > second_node_col) {
            if (!link.hasOwnProperty("link_type")) {
              number_of_links_left += 1;
            } else if (link["link_type"][1] === "L") {
              number_of_links_left += 1;
            } else if (link["link_type"][1] === "R") {
              number_of_links_right += 1;
            }
          } else if (node_column < second_node_col) {
            if (!link.hasOwnProperty("link_type")) {
              number_of_links_right += 1;
            } else if (link["link_type"][0] === "L") {
              number_of_links_left += 1;
            } else if (link["link_type"][0] === "R") {
              number_of_links_right += 1;
            }
          }
        }

        let column_representation: string | number;
        if (this.column_names) {
          column_representation = this.column_names[node_column];
        } else {
          column_representation = node_column + this.start_column_count_from;
        }
        node_position += this.start_node_count_from;

        return {
          label: node_label,
          height: node_height,
          number_of_links: number_of_links,
          left_side_sum: left_side_sum,
          right_side_sum: right_side_sum,
          column: column_representation,
          position: node_position,
          number_of_links_left: number_of_links_left,
          number_of_links_right: number_of_links_right,
        };
      } else {
        console.error("Node not found for given column and position");
        return null;
      }
    } else {
      console.error("Column or position attribute is missing");
      return null;
    }
  }

  private getLinkInfo(e: MouseEvent): any {
    const target = e.target as SVGElement;
    let link_id = parseInt(target.getAttribute("links_array_id")!);
    let link_data = this.links_data[link_id];
    let f_column = parseInt(link_data["from"]["column"]);
    let t_column = parseInt(link_data["to"]["column"]);
    let f_node = parseInt(link_data["from"]["node"]);
    let t_node = parseInt(link_data["to"]["node"]);
    if (link_data.hasOwnProperty("reversed")) {
      [f_column, t_column] = [t_column, f_column];
      [f_node, t_node] = [t_node, f_node];
    }
    let f_label =
      this.nodes_data_structure[f_column][f_node]["properties_object"]["label"];
    let t_label =
      this.nodes_data_structure[t_column][t_node]["properties_object"]["label"];
    let value = link_data["value"];

    let sublink_index = target.getAttribute("sublink_index");
    if (sublink_index) {
      value = link_data["sublinks"][parseInt(sublink_index)]["value"];
    }
    f_node += this.start_node_count_from;
    t_node += this.start_node_count_from;

    let from_column_representation: string | number;
    let to_column_representation: string | number;

    if (this.column_names) {
      from_column_representation = this.column_names[f_column];
      to_column_representation = this.column_names[t_column];
    } else {
      from_column_representation = f_column + this.start_column_count_from;
      to_column_representation = t_column + this.start_column_count_from;
    }

    return {
      from_column: from_column_representation,
      to_column: to_column_representation,
      from_node: f_node,
      to_node: t_node,
      from_label: f_label,
      to_label: t_label,
      value: value,
    };
  }
}
