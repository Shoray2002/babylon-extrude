/**
 * Creates an ArcRotateCamera in the given scene and attaches it to the given canvas.
 * @param {BABYLON.Scene} scene - The scene to create the camera in.
 * @param {HTMLCanvasElement} canvas - The canvas to attach the camera to.
 * @returns {BABYLON.ArcRotateCamera} The created camera.
 */
export function createCamera(scene, canvas) {
  const camera = new BABYLON.ArcRotateCamera(
    "Camera",
    0,
    0,
    20,
    BABYLON.Vector3(0, 0, 0),
    scene
  );
  camera.lowerRadiusLimit = 5;
  camera.upperRadiusLimit = 25;
  camera.upperBetaLimit = Math.PI / 2 - 0.05;
  camera.setPosition(new BABYLON.Vector3(2, 4, 10));
  camera.attachControl(canvas, true);
  camera.radius = 8;
  return camera;
}
