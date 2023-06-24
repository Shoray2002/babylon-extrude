export function setupDragBehavior(scene, mesh) {
  const dragBehavior = new BABYLON.PointerDragBehavior({
    dragPlaneNormal: new BABYLON.Vector3(0, 1, 0),
  });
  dragBehavior.moveAttached = false;
  mesh.addBehavior(dragBehavior);

  return dragBehavior;
}
