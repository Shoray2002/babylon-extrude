export function createMainCube(scene) {
  let mainCube = BABYLON.MeshBuilder.CreateBox(
    "box",
    { width: 1, height: 1, depth: 1, updatable: true },
    scene
  );
  mainCube.position.y = 0.52;
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
