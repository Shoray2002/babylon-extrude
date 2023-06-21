import * as BABYLON from "babylonjs";
const canvas = document.getElementById("canvas");
const engine = new BABYLON.Engine(canvas, true, { stencil: true });
const createScene = function () {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.75, 0.75, 0.75);
  scene.onPointerObservable.add((pointerInfo) => {
    switch (pointerInfo.type) {
      case BABYLON.PointerEventTypes.POINTERMOVE:
        onPointerMove(pointerInfo);
        break;
    }
  });

  const camera = new BABYLON.ArcRotateCamera(
    "Camera",
    0,
    0,
    10,
    new BABYLON.Vector3(0, 0, 0),
    scene
  );
  camera.setPosition(new BABYLON.Vector3(0, 0, 20));
  camera.attachControl(canvas, false);
  // max zoom out
  camera.lowerRadiusLimit = 10;

  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  light.intensity = 0.9;

  const cube = BABYLON.MeshBuilder.CreateBox("cube", { size: 2 }, scene);
  cube.position.y = 2;
  cube.rotation.x = 0.5;
  cube.rotation.y = 0.5;
  cube.rotation.z = 0.5;
  cube.material = new BABYLON.StandardMaterial("cubeMat", scene);
  cube.material.diffuseColor = new BABYLON.Color3(0.85, 0.85, 0.85);

  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 100, height: 100 },
    scene
  );

  ground.material = new BABYLON.StandardMaterial("groundMat", scene);
  ground.material.diffuseColor = new BABYLON.Color3(0.945, 0.937, 0.945);
  ground.material.specularColor = new BABYLON.Color3(1, 0, 0);

  function onPointerMove(pointerInfo) {
    const pickResult = scene.pick(scene.pointerX, scene.pointerY);
    if (pickResult.hit && pickResult.pickedMesh === cube) {
      const faceIndex = getFaceIndex(pickResult.getNormal(true));
      console.log("faceIndex", faceIndex);
      // changeFaceColor(cube, faceIndex, new BABYLON.Color3(1, 0, 0));
    }
    //  else {
    //   resetFaceColors(cube);
    // }
  }

  return scene;
};
const scene = createScene();

engine.runRenderLoop(function () {
  scene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});

function getFaceIndex(normal) {
  if (normal.x === 1) return 0;
  if (normal.x === -1) return 1;
  if (normal.y === 1) return 2;
  if (normal.y === -1) return 3;
  if (normal.z === 1) return 4;
  if (normal.z === -1) return 5;
  return -1;
}

