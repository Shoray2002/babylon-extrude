/**
 * Creates a new main cube mesh in the given scene.
 * @param {BABYLON.Scene} scene - The scene to create the mesh in.
 * @returns {BABYLON.Mesh} The created mesh.
 */
export function createMainCube(scene) {
  let mainCube = BABYLON.MeshBuilder.CreateBox(
    "box",
    { width: 1, height: 1, depth: 1, updatable: true },
    scene
  );
  mainCube.position.y = 0.49 ;
  let mainCubeMaterial = new BABYLON.StandardMaterial(scene);
  mainCubeMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  mainCube.material = mainCubeMaterial;
  mainCube.material.backFaceCulling = false;
  mainCube.enableEdgesRendering();
  mainCube.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
  mainCube.edgesWidth = 2;
  mainCube.disableLighting = true;
  return mainCube;
}

/**
 * Creates a new temporary cube mesh in the given scene at the given position.
 * @param {BABYLON.Scene} scene - The scene to create the mesh in.
 * @param {BABYLON.Vector3} position - The position to create the mesh at.
 * @returns {BABYLON.Mesh} The created mesh.
 */
export function createTempCube(scene, position) {
  let tempCube = BABYLON.MeshBuilder.CreateBox(
    "box",
    { updatable: true },
    scene
  );
  tempCube.position = position;
  let tempCubeMaterial = new BABYLON.StandardMaterial("material2", scene);
  tempCubeMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  tempCubeMaterial.alpha = 0.8;
  tempCube.material = tempCubeMaterial;
  return tempCube;
}

/**
 * Creates a new ground mesh in the given scene.
 * @param {BABYLON.Scene} scene - The scene to create the mesh in.
 * @returns {BABYLON.Mesh} The created mesh.
 */
export function createGround(scene) {
  let ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 100, height: 100 },
    scene
  );
  ground.material = new BABYLON.StandardMaterial("groundMat", scene);
  ground.material.diffuseColor = new BABYLON.Color3(0.9, 0.94, 0.9);
  ground.material.specularColor = new BABYLON.Color3(0, 0, 0);
  ground.material.backFaceCulling = false;
  return ground;
}

/**
 * Creates a new line mesh in the given scene with the given start and end points and position.
 * @param {BABYLON.Scene} scene - The scene to create the mesh in.
 * @param {Array<BABYLON.Vector3>} startPoints - The start points of the line.
 * @param {Array<BABYLON.Vector3>} endPoints - The end points of the line.
 * @param {BABYLON.Vector3} position - The position to create the mesh at.
 * @returns {BABYLON.Mesh} The created mesh.
 */
export function createLine(scene, startPoints, endPoints, position) {
  let start = new BABYLON.Vector3(
    (startPoints[0].x +
      startPoints[1].x +
      startPoints[2].x +
      startPoints[3].x) /
      4,
    (startPoints[0].y +
      startPoints[1].y +
      startPoints[2].y +
      startPoints[3].y) /
      4,
    (startPoints[0].z +
      startPoints[1].z +
      startPoints[2].z +
      startPoints[3].z) /
      4
  );
  let end = new BABYLON.Vector3(
    (endPoints[0].x + endPoints[1].x + endPoints[2].x + endPoints[3].x) / 4,
    (endPoints[0].y + endPoints[1].y + endPoints[2].y + endPoints[3].y) / 4,
    (endPoints[0].z + endPoints[1].z + endPoints[2].z + endPoints[3].z) / 4
  );
  let line = BABYLON.MeshBuilder.CreateLines(
    "line",
    {
      points: [start, end],
    },
    scene
  );
  line.position = position;
  line.color = new BABYLON.Color3(0, 0, 0);
  line.isPickable = false;
  return line;
}