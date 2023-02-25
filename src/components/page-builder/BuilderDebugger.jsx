import { useEditor } from "@craftjs/core";
import { useEffect } from "react";

export default function BuilderDebugger() {
  const { hoveredNodeName, selectedNodeName, state } = useEditor((state) => {
    const currentlyHoveredId = Array.from(state.events.hovered)[0];
    const currentlySelectId = Array.from(state.events.selected)[0];
    console.log("currentlySelectedId", currentlySelectId);
    // console.log(
    //   state.nodes[currentlyHoveredId]
    //     ? state.nodes[currentlyHoveredId].data
    //     : ""
    // );
    return {
      hoveredNodeName: state.nodes[currentlyHoveredId]
        ? state.nodes[currentlyHoveredId].data.displayName
        : "null",
      selectedNodeName: state.nodes[currentlySelectId]
        ? state.nodes[currentlySelectId].data.displayName
        : "null",
      state: state,
    };
  });

  useEffect(() => {
    // console.log(state);
  }, [state]);

  return (
    <>
      <h2>The component being hovered is: {hoveredNodeName}</h2>{" "}
      <h2>The component being selected is: {selectedNodeName}</h2>
    </>
  );
}
