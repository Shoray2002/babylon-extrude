/**
 * Creates a new HemisphericLight in the given scene with the given name and direction.
 * @param {BABYLON.Scene} scene - The scene to create the light in.
 * @returns {BABYLON.HemisphericLight} The created light.
 */
export function createLight(scene) {
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light.intensity = 1;
  return light;
}
