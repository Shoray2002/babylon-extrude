/**
 * Creates a new HemisphericLight in the given scene with the given name and direction.
 * @param {BABYLON.Scene} scene - The scene to create the light in.
 * @returns [{BABYLON.HemisphericLight}] The lights that are created.
 * */

export function createLight(scene) {
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light.intensity = 1;
  const light2 = new BABYLON.HemisphericLight(
    "light2",
    new BABYLON.Vector3(0, -1, 0),
    scene
  );
  return [light, light2];
}
