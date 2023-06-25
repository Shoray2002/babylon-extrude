/**
 * Sets up a pointer drag behavior for the given mesh in the given scene.
 * @param {BABYLON.Scene} scene - The scene to add the drag behavior to.
 * @param {BABYLON.AbstractMesh} mesh - The mesh to add the drag behavior to.
 * @returns {BABYLON.PointerDragBehavior} The created drag behavior.
 */
export function setupDragBehavior(scene, mesh) {
  const dragBehavior = new BABYLON.PointerDragBehavior({
    dragPlaneNormal: new BABYLON.Vector3(0, 1, 0),
  });
  dragBehavior.moveAttached = false;
  mesh.addBehavior(dragBehavior);
  return dragBehavior;
}
