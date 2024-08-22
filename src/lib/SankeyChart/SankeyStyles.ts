export const SANKEY_STYLES = `
/* Existing styles */
rect[identifier=SankeyNode]:hover {
    filter: contrast(1.1) brightness(1.05) drop-shadow(0px 0px 1.7px #000000);
}
.focused_SankeyNode{
    filter: contrast(1.1) brightness(1.05) drop-shadow(0px 0px 1.7px #000000);
}
.hovered_SankeyLink
{
    stroke: rgb(0, 0, 0);
    stroke-width: 1px;
}

@keyframes fadingAnimationNodeInfo {
    0%{opacity: 0}
    100%{opacity: 0.95}
}
@keyframes fadingAnimationLinkInfo {
    0%{opacity: 0;}
    100%{opacity: 0.95}
}
.node_info_div {
    position: fixed;
    background-color: #74a8bb;
    color: white;
    border: solid 2px #c8d3db;
    font-size: 18px;
    min-width: 50px;
    padding: 0 5px 0 5px;
    text-align: center;
    animation: fadingAnimationNodeInfo 0.3s;
    border-radius: 10px;
    opacity: 0.95;
}
.link_info_div
{
    position: fixed;
    background-color: #74a8bb;
    color: white;
    border: solid 2px #c8d3db;
    font-size: 12px;
    min-width: 150px;
    padding: 5px 10px;
    text-align: center;
    animation: fadingAnimationLinkInfo 0.3s;
    border-radius: 10px;
    opacity: 0.95;
    overflow-wrap: break-word;
}
.noselect {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    touch-action: pinch-zoom;
}

/* New styles for full-width */
.sankey-chart-container {
    width: 100%;
    height: auto;
    overflow: visible;
}

.sankey-chart-container svg {
    width: 100%;
    height: auto;
}
`;
